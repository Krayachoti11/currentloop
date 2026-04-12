package com.currentloop.backend.config;

import com.currentloop.backend.model.Subtopic;
import com.currentloop.backend.model.Topic;
import com.currentloop.backend.repository.SubtopicRepository;
import com.currentloop.backend.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;

    public DataInitializer(TopicRepository topicRepository, SubtopicRepository subtopicRepository) {
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
    }

    @Override
    public void run(String... args) {
        if (topicRepository.count() > 0) {
            return;
        }

        List<TopicSeed> seeds = List.of(
                new TopicSeed("Sports", "sports", "⚽", List.of(
                        "Football", "American Football", "Tennis", "Basketball", "Cricket", "Baseball", "Other Sports"
                )),
                new TopicSeed("Movies", "movies", "🎬", List.of(
                        "Telugu", "Hindi", "Tamil", "English", "Other"
                )),
                new TopicSeed("Politics", "politics", "🏛️", List.of(
                        "India", "US", "World", "Elections", "Policy", "Wars", "Trade", "Controversy"
                )),
                new TopicSeed("Music", "music", "🎵", List.of(
                        "Hip Hop", "Pop", "R&B", "Rock", "Indian Music", "Albums & Drops", "Tours & Concerts", "Drama & Beef"
                )),
                new TopicSeed("Tech", "tech", "💻", List.of(
                        "AI", "Phones", "Laptops & PCs", "Social Media", "Gaming Tech", "Apps & Software", "Cybersecurity", "Space & Science"
                )),
                new TopicSeed("Cars", "cars", "🚗", List.of(
                        "Supercars", "EVs", "JDM", "American Muscle", "F1", "Mods & Builds", "News & Releases", "Detailing", "Car Culture"
                )),
                new TopicSeed("Gaming", "gaming", "🎮", List.of(
                        "PC Gaming", "Console", "Mobile Gaming", "Esports", "Game Releases", "Reviews", "Drama & News"
                )),
                new TopicSeed("Fashion", "fashion", "👗", List.of(
                        "Streetwear", "Luxury", "Sneakers", "Fits & Outfits", "Indian Fashion", "Trends", "Celebrity Style"
                )),
                new TopicSeed("Cooking", "cooking", "🍳", List.of(
                        "Indian Food", "American Food", "Asian Food", "Recipes", "Restaurant Reviews", "Healthy Eating", "Street Food"
                )),
                new TopicSeed("Health", "health", "💪", List.of(
                        "Fitness & Gym", "Mental Health", "Nutrition", "Sports Science", "Sleep & Recovery", "Supplements", "Medical News"
                ))
        );

        for (TopicSeed seed : seeds) {
            Topic t = new Topic();
            t.setName(seed.name());
            t.setSlug(seed.slug());
            t.setEmoji(seed.emoji());
            topicRepository.save(t);

            Long topicId = t.getId();
            for (String subName : seed.subtopicNames()) {
                Subtopic s = new Subtopic();
                s.setName(subName);
                s.setSlug(slugify(subName));
                s.setTopicId(topicId);
                subtopicRepository.save(s);
            }
        }
    }

    private static String slugify(String name) {
        return name.toLowerCase()
                .replace("&", "and")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    private record TopicSeed(String name, String slug, String emoji, List<String> subtopicNames) {}
}
