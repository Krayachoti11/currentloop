package com.currentloop.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String emoji;
    private String slug;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmoji() { return emoji; }
    public String getSlug() { return slug; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public void setSlug(String slug) { this.slug = slug; }
}