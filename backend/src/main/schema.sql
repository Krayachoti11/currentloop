-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE
);

-- Sub-subtopics table
CREATE TABLE IF NOT EXISTS sub_subtopics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    subtopic_id INTEGER REFERENCES subtopics(id) ON DELETE CASCADE
);

-- Threads table
CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    subtopic_id INTEGER REFERENCES subtopics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    reply_count INTEGER DEFAULT 0
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);