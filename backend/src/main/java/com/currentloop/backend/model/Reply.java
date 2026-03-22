package com.currentloop.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "replies")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String body;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "thread_id")
    private Long threadId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public String getBody() { return body; }
    public Long getAuthorId() { return authorId; }
    public Long getThreadId() { return threadId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setBody(String body) { this.body = body; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public void setThreadId(Long threadId) { this.threadId = threadId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}