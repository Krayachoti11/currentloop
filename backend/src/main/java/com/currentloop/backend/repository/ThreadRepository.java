package com.currentloop.backend.repository;

import com.currentloop.backend.model.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findBySubtopicId(Long subtopicId);
    List<Thread> findByAuthorId(Long authorId);
}