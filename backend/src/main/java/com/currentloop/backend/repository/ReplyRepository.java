package com.currentloop.backend.repository;

import com.currentloop.backend.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByThreadId(Long threadId);
}