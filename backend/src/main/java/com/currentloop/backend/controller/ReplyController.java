package com.currentloop.backend.controller;

import com.currentloop.backend.model.Reply;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.ReplyRepository;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
            User user = userRepository.findById(reply.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Map<String, Object> replyMap = new java.util.HashMap<>();
            replyMap.put("id", reply.getId());
            replyMap.put("body", reply.getBody());
            replyMap.put("authorId", reply.getAuthorId());
            replyMap.put("username", user.getUsername());
            replyMap.put("threadId", reply.getThreadId());
            replyMap.put("createdAt", reply.getCreatedAt());
            return replyMap;
        }).toList();
    }

    @PostMapping("/{threadId}/replies")
    public Map<String, Object> createReply(
            @PathVariable Long threadId,
            @RequestBody Map<String, String> body
    ) {
        String token = body.get("token");
        String replyBody = body.get("body");

        if (replyBody == null || replyBody.isBlank()) {
            return Map.of("error", "Reply cannot be empty");
        }

        if (token == null || !jwtUtil.validateToken(token)) {
            return Map.of("error", "Not logged in");
        }

        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
        int current = thread.getReplyCount() == null ? 0 : thread.getReplyCount();
        thread.setReplyCount(current + 1);
        threadRepository.save(thread);

        Reply reply = new Reply();
        reply.setBody(replyBody);
        reply.setThreadId(threadId);
        reply.setAuthorId(user.getId());
        reply.setCreatedAt(LocalDateTime.now());
        reply = replyRepository.save(reply);

        return Map.of("success", true, "id", reply.getId());
    }
}
