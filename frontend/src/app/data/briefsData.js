const rawBriefsData = [
  {
    id: "barca-transfer-window",
    topic: "sports",
    subtopic: "football",
    title: "Barcelona transfer window heats up",
    summary:
      "Barcelona are entering a decisive stretch in the transfer window, with growing discussion around incoming depth options, outgoing players, and financial flexibility. The latest updates suggest the club is balancing squad needs with budget limits while trying to stay competitive domestically and in Europe.",
    points: [
      "Barcelona are evaluating multiple transfer options at once.",
      "Budget and wage flexibility remain part of the story.",
      "Outgoing player decisions may affect incoming deals.",
      "Fans are focused on depth, balance, and long-term planning."
    ],
    tags: ["Sports", "Football", "Transfers"],
    updatedAt: "2026-04-12T18:00:00",
    sourceLinks: [
      { label: "Source 1", url: "#" },
      { label: "Source 2", url: "#" },
      { label: "Source 3", url: "#" }
    ],
    discussionSubtopic: "football"
  },
  {
    id: "dhurandhar-2-buzz",
    topic: "movies",
    subtopic: "telugu",
    title: "Dhurandhar 2 buzz keeps growing before release",
    summary:
      "Conversation around Dhurandhar 2 continues to build across fan circles, with attention centered on ticket demand, trailer reaction, and expectations around opening performance. The movie has become one of the most discussed Telugu titles in its release cycle.",
    points: [
      "Advance buzz is growing across fan communities.",
      "Trailer reaction has added momentum to the release cycle.",
      "Booking trends are becoming part of the discussion.",
      "Fans are debating hype versus actual box office performance."
    ],
    tags: ["Movies", "Telugu", "Buzz"],
    updatedAt: "2026-04-12T16:30:00",
    sourceLinks: [
      { label: "Source 1", url: "#" },
      { label: "Source 2", url: "#" }
    ],
    discussionSubtopic: "telugu"
  },
  {
    id: "india-policy-shift",
    topic: "politics",
    subtopic: "india",
    title: "Policy debate grows after latest India announcement",
    summary:
      "A fresh policy announcement has triggered wide discussion around economic priorities, public messaging, and implementation questions. Analysts and citizens are focusing on what changed, who is affected, and how the decision may shape the broader political conversation.",
    points: [
      "The latest announcement has widened political debate.",
      "People are focused on policy impact and implementation.",
      "Supporters and critics are framing the move differently.",
      "The story is evolving through reaction as much as through policy text."
    ],
    tags: ["Politics", "India", "Policy"],
    updatedAt: "2026-04-12T15:00:00",
    sourceLinks: [
      { label: "Source 1", url: "#" },
      { label: "Source 2", url: "#" }
    ],
    discussionSubtopic: "india"
  }
]

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function toSafeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

function toSlug(value, fallback = "general-discussion") {
  const base = toSafeString(value, fallback).toLowerCase()
  return base
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback
}

function normalizeSource(source, index) {
  if (!source || typeof source !== "object") {
    return { label: `Source ${index + 1}`, url: "#" }
  }

  const label = toSafeString(source.label, `Source ${index + 1}`)
  const url = toSafeString(source.url, "#")
  return { label, url }
}

function normalizeBrief(raw, index) {
  const topic = toSlug(raw?.topic, "general")
  const subtopic = toSlug(raw?.subtopic, "general-discussion")
  const id = toSlug(raw?.id || raw?.slug || `${topic}-${subtopic}-${index + 1}`)

  const pointsInput = toArray(raw?.points).length ? raw.points : toArray(raw?.keyPoints)
  const points = pointsInput
    .map((point) => toSafeString(point))
    .filter(Boolean)

  const sourceInput = toArray(raw?.sourceLinks).length ? raw.sourceLinks : toArray(raw?.sources)
  const sourceLinks = sourceInput.map(normalizeSource)

  const tags = toArray(raw?.tags).map((tag) => toSafeString(tag)).filter(Boolean)
  const updatedAt = toSafeString(raw?.updatedAt, new Date(0).toISOString())
  const discussionSubtopic = toSlug(raw?.discussionSubtopic || subtopic, subtopic)

  return {
    id,
    topic,
    subtopic,
    title: toSafeString(raw?.title, "Untitled brief"),
    summary: toSafeString(raw?.summary, "No summary is available yet."),
    points: points.length ? points : ["No key points available yet."],
    tags: tags.length ? tags : ["Brief"],
    updatedAt,
    sourceLinks: sourceLinks.length ? sourceLinks : [{ label: "Source", url: "#" }],
    discussionSubtopic,
  }
}

export const briefsData = rawBriefsData.map(normalizeBrief)

export function getBriefById(id) {
  const normalizedId = toSlug(id || "")
  return briefsData.find((brief) => brief.id === normalizedId) || null
}
