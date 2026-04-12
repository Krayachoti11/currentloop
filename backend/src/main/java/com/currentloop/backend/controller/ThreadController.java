package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ThreadController {

    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final SubtopicRepository subtopicRepository;
    private final JwtUtil jwtUtil;

    public ThreadController(
            ThreadRepository threadRepository,
            UserRepository userRepository,
            SubtopicRepository subtopicRepository,
            JwtUtil jwtUtil
    ) {
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.subtopicRepository = subtopicRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/subtopics/{slug}/threads")
    public List<Map<String, Object>> getThreads(@PathVariable String slug) {
        Subtopic subtopic = subtopicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));

        return threadRepository.findBySubtopicId(subtopic.getId()).stream().map(thread -> {
            User user = userRepository.findById(thread.getAuthorId()).orElse(null);
            String username = (user != null) ? user.getUsername() : "Unknown";

            Map<String, Object> threadMap = new HashMap<>();
            threadMap.put("id", thread.getId());
            threadMap.put("title", thread.getTitle());
            threadMap.put("body", thread.getBody());
            threadMap.put("authorId", thread.getAuthorId());
            threadMap.put("username", username);
            threadMap.put("subtopicId", thread.getSubtopicId());
            threadMap.put("replyCount", thread.getReplyCount());
            threadMap.put("createdAt", thread.getCreatedAt());

            return threadMap;
        }).toList();
    }

    @GetMapping("/threads/{id}")
    public Map<String, Object> getThread(@PathVariable Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        User user = userRepository.findById(thread.getAuthorId()).orElse(null);
        String username = (user != null) ? user.getUsername() : "Unknown";

        Map<String, Object> threadMap = new HashMap<>();
        threadMap.put("id", thread.getId());
        threadMap.put("title", thread.getTitle());
        threadMap.put("body", thread.getBody());
        threadMap.put("authorId", thread.getAuthorId());
        threadMap.put("username", username);
        threadMap.put("subtopicId", thread.getSubtopicId());
        threadMap.put("replyCount", thread.getReplyCount());
        threadMap.put("createdAt", thread.getCreatedAt());

        return threadMap;
    }

    @GetMapping("/users/{username}/threads")
    public List<Map<String, Object>> getUserThreads(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return threadRepository.findByAuthorId(user.getId()).stream().map(thread -> {
            Map<String, Object> threadMap = new HashMap<>();
            threadMap.put("id", thread.getId());
            threadMap.put("title", thread.getTitle());
            threadMap.put("body", thread.getBody());
            threadMap.put("replyCount", thread.getReplyCount());
            threadMap.put("createdAt", thread.getCreatedAt());

            return threadMap;
        }).toList();
    }

    @PostMapping("/threads")
    public Map<String, Object> createThread(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        if (token == null || token.isBlank()) {
            return Map.of("error", "Not logged in");
        }

        String username;
        try {
            username = jwtUtil.get(token);
        } catch (Exception e) {
            return Map.of("error", "Not logged in");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Thread thread = new Thread();
        thread.setTitle(body.get("title"));
        thread.setBody(body.get("body"));
        thread.setAuthorId(user.getId());
        thread.setCreatedAt(LocalDateTime.now());
        thread.setReplyCount(0);

        String subtopicSlug = body.get("subtopicSlug");
        if (subtopicSlug != null && !subtopicSlug.isBlank()) {
            Subtopic subtopic = subtopicRepository.findBySlug(subtopicSlug).orElse(null);
            if (subtopic != null) {
                thread.setSubtopicId(subtopic.getId());
            }
        }

        thread = threadRepository.save(thread);

        return Map.of(
                "id", thread.getId(),
                "title", thread.getTitle()
        );
    }
}
