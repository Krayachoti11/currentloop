package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.SuspiciousActivityFlag;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.Topic;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.SuspiciousActivityFlagRepository;
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
    private final SuspiciousActivityFlagRepository suspiciousActivityFlagRepository;
    private final JwtUtil jwtUtil;

    public ThreadController(ThreadRepository threadRepository,
                            UserRepository userRepository,
                            SubtopicRepository subtopicRepository,
                            TopicRepository topicRepository,
                            SuspiciousActivityFlagRepository suspiciousActivityFlagRepository,
                            JwtUtil jwtUtil) {
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.subtopicRepository = subtopicRepository;
        this.topicRepository = topicRepository;
        this.suspiciousActivityFlagRepository = suspiciousActivityFlagRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> createThread(@RequestBody(required = false) Map<String, String> body,
                                          @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (body == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request body"));
        }

        String token = extractBearerToken(authHeader);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not logged in"));
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
            Optional<Subtopic> subtopicOpt = subtopicRepository.findBySlug(subtopicSlug.trim());
            if (subtopicOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid subtopic"));
            }
            thread.setSubtopicId(subtopicOpt.get().getId());
        }

        Thread saved = threadRepository.save(thread);
        createThreadFlagsIfNeeded(saved);

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

    private void createThreadFlagsIfNeeded(Thread thread) {
        if (thread.getAuthorId() == null || thread.getCreatedAt() == null) {
            return;
        }

        LocalDateTime now = thread.getCreatedAt();
        Long userId = thread.getAuthorId();

        long recentThreadCount = threadRepository.countByAuthorIdAndCreatedAtAfter(userId, now.minusMinutes(5));
        if (recentThreadCount >= 5) {
            saveFlagIfNotRecent(userId, "THREAD_RATE_SPIKE",
                    "User posted " + recentThreadCount + " threads within 5 minutes.");
        }

        long repeatedThreadCount = threadRepository.countByAuthorIdAndTitleAndBodyAndCreatedAtAfter(
                userId,
                thread.getTitle(),
                thread.getBody(),
                now.minusMinutes(30)
        );
        if (repeatedThreadCount >= 3) {
            saveFlagIfNotRecent(userId, "REPEATED_THREAD_CONTENT",
                    "User posted near-identical thread content " + repeatedThreadCount + " times within 30 minutes.");
        }
    }

    private void saveFlagIfNotRecent(Long userId, String type, String message) {
        LocalDateTime dedupeWindowStart = LocalDateTime.now().minusMinutes(15);
        boolean alreadyFlagged = suspiciousActivityFlagRepository
                .existsByUserIdAndTypeAndCreatedAtAfter(userId, type, dedupeWindowStart);
        if (alreadyFlagged) {
            return;
        }

        SuspiciousActivityFlag flag = new SuspiciousActivityFlag();
        flag.setUserId(userId);
        flag.setType(type);
        flag.setMessage(message);
        flag.setCreatedAt(LocalDateTime.now());
        flag.setResolved(false);
        suspiciousActivityFlagRepository.save(flag);
    }
}
