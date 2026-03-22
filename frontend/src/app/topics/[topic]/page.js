export default async function TopicPage(props) {
  const params = await props.params
  const topic = params.topic

  const topicsData = {
    sports: {
      name: "Sports",
      emoji: "⚽",
      subtopics: [
        { name: "Football", subs: ["La Liga", "Premier League", "Serie A", "Bundesliga", "Ligue 1", "Champions League", "International", "Other"] },
        { name: "American Football", subs: ["NFL", "College"] },
        { name: "Tennis", subs: [] },
        { name: "Basketball", subs: ["NBA", "College"] },
        { name: "Cricket", subs: ["International", "IPL"] },
        { name: "Baseball", subs: ["MLB", "College"] },
        { name: "Other Sports", subs: [] },
      ],
    },
    movies: {
      name: "Movies",
      emoji: "🎬",
      subtopics: [
        { name: "Telugu", subs: [] },
        { name: "Hindi", subs: [] },
        { name: "Tamil", subs: [] },
        { name: "English", subs: [] },
        { name: "Other", subs: [] },
      ],
    },
    politics: {
      name: "Politics",
      emoji: "🏛️",
      subtopics: [
        { name: "India", subs: [] },
        { name: "US", subs: [] },
        { name: "World", subs: [] },
        { name: "Elections", subs: [] },
        { name: "Policy", subs: [] },
        { name: "Wars", subs: [] },
        { name: "Trade", subs: [] },
        { name: "Controversy", subs: [] },
      ],
    },
    music: {
      name: "Music",
      emoji: "🎵",
      subtopics: [
        { name: "Hip Hop", subs: [] },
        { name: "Pop", subs: [] },
        { name: "R&B", subs: [] },
        { name: "Rock", subs: [] },
        { name: "Indian Music", subs: ["Bollywood", "Telugu", "Tamil"] },
        { name: "Albums & Drops", subs: [] },
        { name: "Tours & Concerts", subs: [] },
        { name: "Drama & Beef", subs: [] },
      ],
    },
    tech: {
      name: "Tech",
      emoji: "💻",
      subtopics: [
        { name: "AI", subs: [] },
        { name: "Phones", subs: [] },
        { name: "Laptops & PCs", subs: [] },
        { name: "Social Media", subs: [] },
        { name: "Gaming Tech", subs: [] },
        { name: "Apps & Software", subs: [] },
        { name: "Cybersecurity", subs: [] },
        { name: "Space & Science", subs: [] },
      ],
    },
    cars: {
      name: "Cars",
      emoji: "🚗",
      subtopics: [
        { name: "Supercars", subs: [] },
        { name: "EVs", subs: [] },
        { name: "JDM", subs: [] },
        { name: "American Muscle", subs: [] },
        { name: "F1", subs: [] },
        { name: "Mods & Builds", subs: [] },
        { name: "News & Releases", subs: [] },
        { name: "Detailing", subs: [] },
        { name: "Car Culture", subs: [] },
      ],
    },
    gaming: {
      name: "Gaming",
      emoji: "🎮",
      subtopics: [
        { name: "PC Gaming", subs: [] },
        { name: "Console", subs: ["PlayStation", "Xbox", "Nintendo"] },
        { name: "Mobile Gaming", subs: [] },
        { name: "Esports", subs: [] },
        { name: "Game Releases", subs: [] },
        { name: "Reviews", subs: [] },
        { name: "Drama & News", subs: [] },
      ],
    },
    fashion: {
      name: "Fashion",
      emoji: "👗",
      subtopics: [
        { name: "Streetwear", subs: [] },
        { name: "Luxury", subs: [] },
        { name: "Sneakers", subs: [] },
        { name: "Fits & Outfits", subs: [] },
        { name: "Indian Fashion", subs: [] },
        { name: "Trends", subs: [] },
        { name: "Celebrity Style", subs: [] },
      ],
    },
    cooking: {
      name: "Cooking",
      emoji: "🍳",
      subtopics: [
        { name: "Indian Food", subs: [] },
        { name: "American Food", subs: [] },
        { name: "Asian Food", subs: [] },
        { name: "Recipes", subs: [] },
        { name: "Restaurant Reviews", subs: [] },
        { name: "Healthy Eating", subs: [] },
        { name: "Street Food", subs: [] },
      ],
    },
    health: {
      name: "Health",
      emoji: "💪",
      subtopics: [
        { name: "Fitness & Gym", subs: [] },
        { name: "Mental Health", subs: [] },
        { name: "Nutrition", subs: [] },
        { name: "Sports Science", subs: [] },
        { name: "Sleep & Recovery", subs: [] },
        { name: "Supplements", subs: [] },
        { name: "Medical News", subs: [] },
      ],
    },
  };

  const topicData = topicsData[topic?.toLowerCase()];

  if (!topicData) {
    return (
      <main style={{ fontFamily: "sans-serif", padding: "40px" }}>
        Topic not found. You typed: {topic}
      </main>
    );
  }

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          borderBottom: "2px solid #eee",
          paddingBottom: "16px",
          marginBottom: "32px",
        }}
      >
        <a
          href="/"
          style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}
        >
          ← Back to Home
        </a>

        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0" }}>
          {topicData.emoji} {topicData.name}
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {topicData.subtopics.map((subtopic) => (
          <a
            key={subtopic.name}
            href={`/topics/${topic}/${subtopic.name.toLowerCase().replace(/ /g, "-")}`}
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "16px",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "10px" }}>
              {subtopic.name}
            </div>

            {subtopic.subs.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {subtopic.subs.map((sub) => (
                  <span
                    key={sub}
                    style={{
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      color: "#444",
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}