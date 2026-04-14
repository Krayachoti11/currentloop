package com.currentloop.backend.controller;

import com.currentloop.backend.model.Reply;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.ReplyRepository;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/threads")
public class ReplyController {

    private final ReplyRepository replyRepository;
    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ReplyController(
            ReplyRepository replyRepository,
            ThreadRepository threadRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.replyRepository = replyRepository;
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{threadId}/replies")
    public List<Map<String, Object>> getReplies(@PathVariable Long threadId) {
        return replyRepository.findByThreadId(threadId).stream().map(reply -> {
            Map<String, Object> replyMap = new HashMap<>();
            replyMap.put("id", reply.getId());
            replyMap.put("body", reply.getBody());
            replyMap.put("authorId", reply.getAuthorId());
            replyMap.put("threadId", reply.getThreadId());
            replyMap.put("createdAt", reply.getCreatedAt());

            String username = "deleted-user";
            if (reply.getAuthorId() != null) {
                username = userRepository.findById(reply.getAuthorId())
                        .map(User::getUsername)
                        .orElse("deleted-user");
            }
            replyMap.put("username", username);

            return replyMap;
        }).toList();
    }

    @PostMapping("/{threadId}/replies")
    public ResponseEntity<?> createReply(
            @PathVariable Long threadId,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String replyBody = body.get("body");

        if (replyBody == null || replyBody.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Reply cannot be empty"));
        }

        String token = extractBearerToken(authHeader);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not logged in"));
        }

        String username = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        Optional<Thread> threadOpt = threadRepository.findById(threadId);
        if (threadOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Thread not found"));
        }

        Thread thread = threadOpt.get();
        int current = thread.getReplyCount() == null ? 0 : thread.getReplyCount();
        thread.setReplyCount(current + 1);
        threadRepository.save(thread);

        Reply reply = new Reply();
        reply.setBody(replyBody.trim());
        reply.setThreadId(threadId);
        reply.setAuthorId(userOpt.get().getId());
        reply.setCreatedAt(LocalDateTime.now());
        reply = replyRepository.save(reply);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", reply.getId(), "body", reply.getBody(), "username", username, "threadId", threadId));
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7).trim();
    }
}
