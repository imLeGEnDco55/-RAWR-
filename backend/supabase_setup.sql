-- §.RAWR.§ — Supabase Schema Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(384),     -- all-MiniLM-L6-v2 output dimension
  compressed TEXT,           -- §Codec compressed version
  source TEXT DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vector similarity index (IVFFlat — good for <100K rows)
CREATE INDEX IF NOT EXISTS memories_embedding_idx
  ON memories USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- 4. Semantic search function (used by /api/retrieve)
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding VECTOR(384),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  compressed TEXT,
  source TEXT,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.content,
    m.compressed,
    m.source,
    m.tags,
    m.metadata,
    m.created_at,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM memories m
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. (Optional) Row Level Security — enable when you add auth
-- ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "anon_read" ON memories FOR SELECT USING (true);
-- CREATE POLICY "anon_insert" ON memories FOR INSERT WITH CHECK (true);
