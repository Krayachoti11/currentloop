package com.currentloop.backend.controller;

import com.currentloop.backend.model.Reply;
import com.currentloop.backend.model.SuspiciousActivityFlag;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.ReplyRepository;
import com.currentloop.backend.repository.SuspiciousActivityFlagRepository;
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
    private final SuspiciousActivityFlagRepository suspiciousActivityFlagRepository;
    private final JwtUtil jwtUtil;

    public ReplyController(
            ReplyRepository replyRepository,
            ThreadRepository threadRepository,
            UserRepository userRepository,
            SuspiciousActivityFlagRepository suspiciousActivityFlagRepository,
            JwtUtil jwtUtil
    ) {
        this.replyRepository = replyRepository;
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.suspiciousActivityFlagRepository = suspiciousActivityFlagRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{threadId}/replies")
    public List<Map<String, Object>> getReplies(@PathVariable Long threadId) {
        return replyRepository.findByThreadIdOrderByCreatedAtAsc(threadId)
                .stream()
                .map(this::toReplyResponse)
                .toList();
    }

    @PostMapping("/{threadId}/replies")
    public ResponseEntity<?> createReply(
            @PathVariable Long threadId,
            @RequestBody(required = false) Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (body == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request body"));
        }
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
        createReplyFlagsIfNeeded(reply);

        return ResponseEntity.status(HttpStatus.CREATED).body(toReplyResponse(reply));
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7).trim();
    }

    private Map<String, Object> toReplyResponse(Reply reply) {
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
    }

    private void createReplyFlagsIfNeeded(Reply reply) {
        if (reply.getAuthorId() == null || reply.getCreatedAt() == null) {
            return;
        }

        LocalDateTime now = reply.getCreatedAt();
        Long userId = reply.getAuthorId();

        long recentReplyCount = replyRepository.countByAuthorIdAndCreatedAtAfter(userId, now.minusMinutes(2));
        if (recentReplyCount >= 10) {
            saveFlagIfNotRecent(userId, "REPLY_RATE_SPIKE",
                    "User posted " + recentReplyCount + " replies within 2 minutes.");
        }

        long repeatedReplyCount = replyRepository.countByAuthorIdAndBodyAndCreatedAtAfter(
                userId,
                reply.getBody(),
                now.minusMinutes(15)
        );
        if (repeatedReplyCount >= 4) {
            saveFlagIfNotRecent(userId, "REPEATED_REPLY_CONTENT",
                    "User posted identical reply content " + repeatedReplyCount + " times within 15 minutes.");
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
