package com.currentloop.backend.repository;

import com.currentloop.backend.model.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findBySubtopicId(Long subtopicId);
    List<Thread> findBySubtopicIdOrderByCreatedAtDesc(Long subtopicId);
    List<Thread> findByAuthorId(Long authorId);
    List<Thread> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    long countByAuthorIdAndCreatedAtAfter(Long authorId, LocalDateTime createdAt);
    long countByAuthorIdAndTitleAndBodyAndCreatedAtAfter(Long authorId, String title, String body, LocalDateTime createdAt);
}
