package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.Topic;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.TopicRepository;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/threads")
public class ThreadController {

    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final SubtopicRepository subtopicRepository;
    private final TopicRepository topicRepository;
    private final JwtUtil jwtUtil;

    public ThreadController(ThreadRepository threadRepository,
                            UserRepository userRepository,
                            SubtopicRepository subtopicRepository,
                            TopicRepository topicRepository,
                            JwtUtil jwtUtil) {
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.subtopicRepository = subtopicRepository;
        this.topicRepository = topicRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> createThread(@RequestBody Map<String, String> body,
    public ResponseEntity<?> createThread(@RequestBody(required = false) Map<String, String> body,
                                          @RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = extractBearerToken(authHeader);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not logged in"));
        }

        String title = body.get("title");
        String content = body.getOrDefault("content", body.get("body"));
        String subtopicSlug = body.get("subtopicSlug");

        if (body == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request body"));
        }

        String title = body.get("title");
        String content = body.getOrDefault("content", body.get("body"));
        String subtopicSlug = body.get("subtopicSlug");

        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Title is required"));
        }
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Content is required"));
        }

        String username = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        Thread thread = new Thread();
        thread.setTitle(title.trim());
        thread.setBody(content.trim());
        thread.setAuthorId(userOpt.get().getId());
        thread.setCreatedAt(LocalDateTime.now());
        thread.setReplyCount(0);

        if (subtopicSlug != null && !subtopicSlug.isBlank()) {
            subtopicRepository.findBySlug(subtopicSlug.trim())
                    .ifPresent(subtopic -> thread.setSubtopicId(subtopic.getId()));
            Optional<Subtopic> subtopicOpt = subtopicRepository.findBySlug(subtopicSlug.trim());
            if (subtopicOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid subtopic"));
            }
            thread.setSubtopicId(subtopicOpt.get().getId());
        }

        Thread saved = threadRepository.save(thread);
        return ResponseEntity.status(HttpStatus.CREATED).body(toThreadResponse(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getThreadById(@PathVariable Long id) {
        return threadRepository.findById(id)
                .<ResponseEntity<?>>map(thread -> ResponseEntity.ok(toThreadResponse(thread)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Thread not found")));
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }
        if (!authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7).trim();
    }

    private Map<String, Object> toThreadResponse(Thread thread) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", thread.getId());
        data.put("title", thread.getTitle());
        data.put("body", thread.getBody());
        data.put("content", thread.getBody());
        data.put("authorId", thread.getAuthorId());
        data.put("replyCount", thread.getReplyCount() == null ? 0 : thread.getReplyCount());
        data.put("createdAt", thread.getCreatedAt());

        String username = "deleted-user";
        if (thread.getAuthorId() != null) {
            username = userRepository.findById(thread.getAuthorId())
                    .map(User::getUsername)
                    .orElse("deleted-user");
        }
        data.put("username", username);

        if (thread.getSubtopicId() != null) {
            subtopicRepository.findById(thread.getSubtopicId()).ifPresent(subtopic -> {
                data.put("subtopicId", subtopic.getId());
                data.put("subtopicSlug", subtopic.getSlug());

                if (subtopic.getTopicId() != null) {
                    topicRepository.findById(subtopic.getTopicId())
                            .map(Topic::getSlug)
                            .ifPresent(topicSlug -> data.put("topicSlug", topicSlug));
                }
            });
        }

        return data;
    }
}
