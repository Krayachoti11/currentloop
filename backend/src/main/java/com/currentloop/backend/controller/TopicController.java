package com.currentloop.backend.controller;

import com.currentloop.backend.model.Topic;
import com.currentloop.backend.repository.TopicRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:3000")
public class TopicController {

    private final TopicRepository topicRepository;

    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }
}