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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ThreadController {

    private final ThreadRepository threadRepository;
    private final SubtopicRepository subtopicRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ThreadController(
            ThreadRepository threadRepository,
            SubtopicRepository subtopicRepository,
            TopicRepository topicRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.threadRepository = threadRepository;
        this.subtopicRepository = subtopicRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/subtopics/{slug}/threads")
    public List<Map<String, Object>> getThreads(@PathVariable String slug) {
        Subtopic subtopic = subtopicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));
        Topic topic = topicRepository.findById(subtopic.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        return threadRepository.findBySubtopicIdOrderByCreatedAtDesc(subtopic.getId()).stream().map(thread -> {
            User user = userRepository.findById(thread.getAuthorId()).orElse(null);

            String username = (user != null) ? user.getUsername() : "Unknown";

            return toThreadMap(thread, username, topic.getSlug(), subtopic.getSlug());
        }).toList();
    }

    return Map.of(
        "id", thread.getId(),
        "title", thread.getTitle(),
        "body", thread.getBody(),
        "authorId", thread.getAuthorId(),
        "username", username,
        "subtopicId", thread.getSubtopicId(),
        "replyCount", thread.getReplyCount(),
        "createdAt", thread.getCreatedAt()
    );
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
        User user = userRepository.findById(thread.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String topicSlug = null;
        String subtopicSlug = null;
        if (thread.getSubtopicId() != null) {
            Subtopic st = subtopicRepository.findById(thread.getSubtopicId()).orElse(null);
            if (st != null) {
                subtopicSlug = st.getSlug();
                Topic tp = topicRepository.findById(st.getTopicId()).orElse(null);
                if (tp != null) {
                    topicSlug = tp.getSlug();
                }
            }
        }

        return toThreadMap(thread, user.getUsername(), topicSlug, subtopicSlug);
    }

    @GetMapping("/users/{username}/threads")
    public List<Map<String, Object>> getUserThreads(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return threadRepository.findByAuthorIdOrderByCreatedAtDesc(user.getId()).stream().map(thread -> {
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

        if (token == null || !jwtUtil.validateToken(token)) {
            return Map.of("error", "Not logged in");
        }

        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String slug = body.get("subtopicSlug");
        if (slug != null) {
            slug = slug.trim();
        }
        boolean hasSubtopicSlug = slug != null && !slug.isEmpty();

        Thread thread = new Thread();
        thread.setTitle(body.get("title"));
        thread.setBody(body.get("body"));
        thread.setAuthorId(user.getId());
        if (hasSubtopicSlug) {
            Subtopic subtopic = subtopicRepository.findBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Subtopic not found"));
            thread.setSubtopicId(subtopic.getId());
        } else {
            thread.setSubtopicId(null);
        }
        thread.setReplyCount(0);
        thread.setCreatedAt(LocalDateTime.now());

        thread = threadRepository.save(thread);

        Map<String, Object> response = new HashMap<>();
        response.put("id", thread.getId());
        response.put("title", thread.getTitle());
        if (hasSubtopicSlug) {
            response.put("subtopicSlug", slug);
        }
        return response;
    }

    private Map<String, Object> toThreadMap(
            Thread thread,
            String username,
            String topicSlug,
            String subtopicSlug
    ) {
        Map<String, Object> threadMap = new HashMap<>();
        threadMap.put("id", thread.getId());
        threadMap.put("title", thread.getTitle());
        threadMap.put("body", thread.getBody());
        threadMap.put("authorId", thread.getAuthorId());
        threadMap.put("username", user.getUsername());
        threadMap.put("subtopicId", thread.getSubtopicId());
        threadMap.put("replyCount", thread.getReplyCount());
        threadMap.put("createdAt", thread.getCreatedAt());
        if (topicSlug != null) {
            threadMap.put("topicSlug", topicSlug);
        }
        if (subtopicSlug != null) {
            threadMap.put("subtopicSlug", subtopicSlug);
        }
        return threadMap;
    }
}
