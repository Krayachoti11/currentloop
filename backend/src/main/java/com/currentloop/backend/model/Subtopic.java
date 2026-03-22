package com.currentloop.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subtopics")
public class Subtopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;

    @Column(name = "topic_id")
    private Long topicId;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public Long getTopicId() { return topicId; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
}