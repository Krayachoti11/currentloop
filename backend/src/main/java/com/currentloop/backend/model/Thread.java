package com.currentloop.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "threads")
public class Thread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String body;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "subtopic_id")
    private Long subtopicId;

    @Column(name = "reply_count")
    private Integer replyCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Long getAuthorId() { return authorId; }
    public Long getSubtopicId() { return subtopicId; }
    public Integer getReplyCount() { return replyCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setBody(String body) { this.body = body; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public void setSubtopicId(Long subtopicId) { this.subtopicId = subtopicId; }
    public void setReplyCount(Integer replyCount) { this.replyCount = replyCount; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}