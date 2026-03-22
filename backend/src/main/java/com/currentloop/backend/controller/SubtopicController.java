package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Topic;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.TopicRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:3000")
public class SubtopicController {

    private final SubtopicRepository subtopicRepository;
    private final TopicRepository topicRepository;

    public SubtopicController(SubtopicRepository subtopicRepository, TopicRepository topicRepository) {
        this.subtopicRepository = subtopicRepository;
        this.topicRepository = topicRepository;
    }

    @GetMapping("/{slug}/subtopics")
    public List<Subtopic> getSubtopics(@PathVariable String slug) {
        Topic topic = topicRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
        return subtopicRepository.findByTopicId(topic.getId());
    }
}