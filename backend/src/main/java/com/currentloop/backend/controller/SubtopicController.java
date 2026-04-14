package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/subtopics")
public class SubtopicController {

    private final SubtopicRepository subtopicRepository;
    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;

    public SubtopicController(SubtopicRepository subtopicRepository,
                              ThreadRepository threadRepository,
                              UserRepository userRepository) {
        this.subtopicRepository = subtopicRepository;
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{slug}/threads")
    public List<Map<String, Object>> getThreadsBySubtopic(@PathVariable String slug) {
        Optional<Subtopic> subtopicOpt = subtopicRepository.findBySlug(slug);
        if (subtopicOpt.isEmpty()) {
            return List.of();
        }

        return threadRepository.findBySubtopicId(subtopicOpt.get().getId())
                .stream()
                .map(thread -> toThreadSummary(thread, slug))
                .toList();
    }

    private Map<String, Object> toThreadSummary(Thread thread, String subtopicSlug) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", thread.getId());
        summary.put("title", thread.getTitle());
        summary.put("body", thread.getBody());
        summary.put("replyCount", thread.getReplyCount() == null ? 0 : thread.getReplyCount());
        summary.put("createdAt", thread.getCreatedAt());
        summary.put("subtopicSlug", subtopicSlug);

        String username = "deleted-user";
        if (thread.getAuthorId() != null) {
            username = userRepository.findById(thread.getAuthorId())
                    .map(User::getUsername)
                    .orElse("deleted-user");
        }
        summary.put("username", username);

        return summary;
    }
}
