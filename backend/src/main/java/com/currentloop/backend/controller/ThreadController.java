package com.currentloop.backend.controller;

import com.currentloop.backend.model.Thread;
import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.repository.ThreadRepository;
import com.currentloop.backend.repository.SubtopicRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ThreadController {

    private final ThreadRepository threadRepository;
    private final SubtopicRepository subtopicRepository;

    public ThreadController(ThreadRepository threadRepository, SubtopicRepository subtopicRepository) {
        this.threadRepository = threadRepository;
        this.subtopicRepository = subtopicRepository;
    }

    @GetMapping("/subtopics/{slug}/threads")
    public List<Thread> getThreads(@PathVariable String slug) {
        Subtopic subtopic = subtopicRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Subtopic not found"));
        return threadRepository.findBySubtopicId(subtopic.getId());
    }

    @GetMapping("/threads/{id}")
    public Thread getThread(@PathVariable Long id) {
        return threadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
    }
}