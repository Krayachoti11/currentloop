package com.currentloop.backend.controller;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Topic;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.TopicRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;

    public TopicController(TopicRepository topicRepository, SubtopicRepository subtopicRepository) {
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
    }

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @GetMapping("/{slug}/subtopics")
    public ResponseEntity<List<Subtopic>> getSubtopics(@PathVariable String slug) {
        return topicRepository.findBySlug(slug)
                .map(topic -> ResponseEntity.ok(subtopicRepository.findByTopicId(topic.getId())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
