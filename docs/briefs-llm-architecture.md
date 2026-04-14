# CurrentLoop Briefs: Real LLM Integration Architecture (Planning)

## Scope
This document proposes a practical backend architecture for moving Briefs from mock data to real LLM-generated content.
It intentionally avoids full implementation details and focuses on a phased, low-risk path.

## Objectives
- Keep Community and existing flows stable.
- Introduce LLM-generated Briefs with structured, validated output.
- Store generated briefs in PostgreSQL for deterministic rendering.
- Preserve `Start Discussion` flow by mapping each brief to a valid community subtopic slug.

## Recommended Data Model

### 1) `briefs`
- `id` (PK)
- `slug` (unique, indexed)
- `title` (required)
- `summary` (required)
- `topic_slug` (required)
- `subtopic_slug` (required)
- `discussion_subtopic_slug` (required)
- `updated_at` (required)
- `status` (`draft|published|failed`)
- `source_count` (denormalized optional)
- `created_at` / `updated_at`

### 2) `brief_points`
- `id` (PK)
- `brief_id` (FK)
- `position` (int)
- `content` (text)

### 3) `brief_tags`
- `id` (PK)
- `brief_id` (FK)
- `tag` (varchar)

### 4) `brief_sources`
- `id` (PK)
- `brief_id` (FK)
- `label` (varchar)
- `url` (text)
- `publisher` (optional)
- `published_at` (optional)

### 5) `brief_generation_jobs` (optional but recommended early)
- `id` (PK)
- `topic_slug`
- `subtopic_slug`
- `input_context_json` (jsonb)
- `provider` (`openai` etc.)
- `model`
- `status` (`queued|running|succeeded|failed`)
- `error_message`
- `started_at` / `finished_at`

## Backend Endpoint Plan

### Public read endpoints
- `GET /api/briefs`
  - Supports pagination (`page`, `limit`) and optional filters (`topic`, `subtopic`).
  - Response shape mirrors current frontend usage: `id/slug`, `title`, `summary`, `tags`, `topic`, `subtopic`, `updatedAt`.

- `GET /api/briefs/{idOrSlug}`
  - Returns full detail payload: title, summary, points, sourceLinks, tags, updatedAt, discussionSubtopic.

### Admin/internal generation endpoints (foundation)
- `POST /api/admin/briefs/generate`
  - Request: `{ topicSlug, subtopicSlug, context? }`
  - Creates a generation job and returns job id.

- `POST /api/admin/briefs/{id}/publish`
  - Publishes a generated draft.

- `GET /api/admin/brief-jobs/{jobId}`
  - Returns generation status and failure reason if any.

> For now, only planning these routes is recommended. Implement read routes first, generation routes later.

## Where LLM Provider Code Should Live

Use a thin service boundary under backend:

- `backend/src/main/java/com/currentloop/backend/briefs/`
  - `BriefService` (orchestrates validation, persistence, formatting)
  - `BriefPromptBuilder` (builds strict prompt templates)
  - `BriefOutputParser` (schema validation + fallback repair)
  - `LlmClient` interface
  - `OpenAiLlmClient` implementation (provider-specific)

This keeps controller logic small and makes provider swapping easy.

## Prompt + Structured Output Strategy

### Prompt design
- System prompt: concise newsroom style, factual tone, no speculation.
- User payload: topic/subtopic + curated context chunks.
- Hard constraints:
  - 1 title
  - 1 summary
  - 4-6 points
  - 2-6 source links
  - 2-5 tags
  - valid `discussionSubtopic` matching known subtopic slugs

### Output format
Require strict JSON matching a schema, e.g.:

```json
{
  "title": "...",
  "summary": "...",
  "points": ["..."],
  "tags": ["..."],
  "sourceLinks": [{"label":"...","url":"..."}],
  "discussionSubtopic": "football"
}
```

### Validation layer
- Validate output server-side before save:
  - non-empty title/summary/points
  - valid URL format for source links
  - `discussionSubtopic` exists in DB subtopics
- On schema failure: mark job failed and keep error payload for diagnostics.

## Start Discussion Integration

Current frontend already builds:
`/thread/new?subtopic={discussionSubtopic}&title=...&body=...`

To keep this working with generated briefs:
- Always persist `discussion_subtopic_slug` as a real subtopic slug.
- Build `Start Discussion` directly from persisted brief fields.
- Keep current fallback behavior in frontend (`discussionSubtopic || subtopic`) for safety.

## Minimum Files for First Real Step

### Backend (minimum)
1. `model/Brief.java`
2. `repository/BriefRepository.java`
3. `controller/BriefController.java` (read endpoints only)
4. migration/schema update for `briefs` table
5. optional mapper/DTO class for read payloads

### Frontend (minimum)
- Replace `briefsData` read path with API fetch in:
  - `frontend/src/app/briefs/page.js`
  - `frontend/src/app/briefs/[id]/page.js`

No LLM provider call needed in phase 1.

## Phased Implementation Order

### Phase 1 (safe foundation)
- Add `briefs` table + repository + read endpoints.
- Seed with existing mock briefs (one-time bootstrap).
- Frontend reads from API instead of static file.

### Phase 2 (generation plumbing)
- Add generation job table + statuses.
- Add `LlmClient` interface + provider implementation.
- Add admin/internal generate endpoint.

### Phase 3 (quality and controls)
- Add schema validation + retries + failure reasons.
- Add dedupe checks to avoid repeating near-identical briefs.
- Add publish workflow and simple admin moderation endpoint.

### Phase 4 (operational polish)
- Add observability: request ids, latency metrics, token usage.
- Add rate limits for generation routes.
- Add admin UI later (out of scope now).

## Non-Goals for This Planning Step
- No auto-posting generated content directly to community.
- No full admin dashboard implementation.
- No complex multi-provider orchestration.
- No vector retrieval stack yet.
