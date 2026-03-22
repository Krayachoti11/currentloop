package com.currentloop.backend.repository;

import com.currentloop.backend.model.Subtopic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {
    List<Subtopic> findByTopicId(Long topicId);
    Optional<Subtopic> findBySlug(String slug);
}
