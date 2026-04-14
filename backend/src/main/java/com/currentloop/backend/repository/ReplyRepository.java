package com.currentloop.backend.repository;

import com.currentloop.backend.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByThreadId(Long threadId);
    List<Reply> findByThreadIdOrderByCreatedAtAsc(Long threadId);
    long countByAuthorIdAndCreatedAtAfter(Long authorId, LocalDateTime createdAt);
    long countByAuthorIdAndBodyAndCreatedAtAfter(Long authorId, String body, LocalDateTime createdAt);
}
