package com.currentloop.backend.controller;

import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;

    public UserController(UserRepository userRepository, ThreadRepository threadRepository) {
        this.userRepository = userRepository;
        this.threadRepository = threadRepository;
    }

    @GetMapping("/{username}/threads")
    public List<Map<String, Object>> getUserThreads(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }

        Long userId = userOpt.get().getId();
        return threadRepository.findByAuthorIdOrderByCreatedAtDesc(userId).stream().map(this::toThreadSummary).toList();
    }

    private Map<String, Object> toThreadSummary(Thread thread) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", thread.getId());
        summary.put("title", thread.getTitle());
        summary.put("body", thread.getBody());
        summary.put("replyCount", thread.getReplyCount() == null ? 0 : thread.getReplyCount());
        summary.put("createdAt", thread.getCreatedAt());
        return summary;
    }
}
