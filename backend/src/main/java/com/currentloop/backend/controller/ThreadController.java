package com.currentloop.backend.controller;

import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/threads")
public class ThreadController {

    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final SubtopicRepository subtopicRepository;
    private final JwtUtil jwtUtil;

    public ThreadController(ThreadRepository threadRepository,
                            UserRepository userRepository,
                            SubtopicRepository subtopicRepository,
                            JwtUtil jwtUtil) {
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
        this.subtopicRepository = subtopicRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public Thread createThread(@RequestBody Map<String, String> body,
                               @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

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

        return threadRepository.save(thread);
    }
}


