"""
§.RAWR.§ — Memory Bridge API
Recuerdos del ALMA de Wai Revolucionaria

Backend: FastAPI + Supabase (pgvector) + Local Embeddings + §Codec
"""

import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

from codec import codec
from models import (
    StoreRequest, StoreResponse,
    RetrieveRequest, RetrieveResponse,
    CompressRequest, CompressResponse,
    DecompressRequest, DecompressResponse,
    HealthResponse, MemoryItem,
)

load_dotenv()

# ═══════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

EMBED_MODEL = "all-MiniLM-L6-v2"  # 80MB, 384 dims, CPU-only, offline
EMBED_DIM = 384
TABLE_NAME = "memories"

log = logging.getLogger("rawr")
logging.basicConfig(level=logging.INFO)

# ═══════════════════════════════════════════════════════════
# GLOBALS
# ═══════════════════════════════════════════════════════════

supabase: Client | None = None
embedder: SentenceTransformer | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / Shutdown"""
    global supabase, embedder

    # Supabase
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        log.info("✅ Supabase connected")
    else:
        log.warning("⚠️ Supabase not configured — running in demo mode")

    # Local embedding model (downloads ~80MB on first run, then cached)
    log.info(f"⏳ Loading embedding model: {EMBED_MODEL}...")
    embedder = SentenceTransformer(EMBED_MODEL)
    log.info("✅ Embedding model ready (local, offline, $0)")

    yield


# ═══════════════════════════════════════════════════════════
# APP
# ═══════════════════════════════════════════════════════════

app = FastAPI(
    title="§.RAWR.§ Memory Bridge",
    description="Recuerdos del ALMA de Wai Revolucionaria — Shared Memory API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════

def embed_text(text: str) -> list[float]:
    """Generate embedding vector using local sentence-transformers model"""
    if not embedder:
        raise HTTPException(503, "Embedding model not loaded")
    vector = embedder.encode(text)
    return vector.tolist()


# ═══════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.post("/api/store", response_model=StoreResponse)
async def store_memory(req: StoreRequest):
    """Store a new memory with automatic embedding + §Codec compression"""
    if not supabase:
        raise HTTPException(503, "Supabase not configured")

    # 1. Compress with §Codec
    compressed = codec.compress(req.content)
    savings = codec.estimate_savings(req.content, compressed)

    # 2. Generate embedding (local, instant)
    embedding = embed_text(req.content)

    # 3. Store in Supabase
    record = {
        "content": req.content,
        "embedding": embedding,
        "compressed": compressed,
        "source": req.source,
        "tags": req.tags,
        "metadata": req.metadata or {},
    }

    result = supabase.table(TABLE_NAME).insert(record).execute()

    if not result.data:
        raise HTTPException(500, "Failed to store memory")

    stored_id = result.data[0]["id"]
    log.info(f"§ Stored memory {stored_id} from {req.source} ({savings['savings_percent']}% compressed)")

    return StoreResponse(
        success=True,
        id=stored_id,
        compressed=compressed,
        savings=savings,
    )


@app.get("/api/retrieve", response_model=RetrieveResponse)
async def retrieve_memories(query: str, limit: int = 5):
    """Semantic search across all memories"""
    if not supabase:
        raise HTTPException(503, "Supabase not configured")

    if limit < 1 or limit > 20:
        limit = 5

    # 1. Embed the query (local, instant)
    query_embedding = embed_text(query)

    # 2. Search via pgvector RPC function
    result = supabase.rpc("match_memories", {
        "query_embedding": query_embedding,
        "match_count": limit,
    }).execute()

    if not result.data:
        return RetrieveResponse(query=query, results=[], count=0)

    # 3. Map results
    memories = []
    for row in result.data:
        memories.append(MemoryItem(
            id=row["id"],
            content=row["content"],
            compressed=row.get("compressed"),
            source=row.get("source", "unknown"),
            tags=row.get("tags", []),
            metadata=row.get("metadata"),
            similarity=row.get("similarity"),
            created_at=row.get("created_at", datetime.now()),
        ))

    log.info(f"§ Retrieved {len(memories)} memories for query: {query[:50]}...")

    return RetrieveResponse(query=query, results=memories, count=len(memories))


@app.get("/api/recent", response_model=RetrieveResponse)
async def recent_memories(count: int = 10):
    """Get the most recent memories"""
    if not supabase:
        raise HTTPException(503, "Supabase not configured")

    if count < 1 or count > 50:
        count = 10

    result = (
        supabase.table(TABLE_NAME)
        .select("*")
        .order("created_at", desc=True)
        .limit(count)
        .execute()
    )

    memories = []
    for row in (result.data or []):
        memories.append(MemoryItem(
            id=row["id"],
            content=row["content"],
            compressed=row.get("compressed"),
            source=row.get("source", "unknown"),
            tags=row.get("tags", []),
            metadata=row.get("metadata"),
            similarity=None,
            created_at=row.get("created_at", datetime.now()),
        ))

    return RetrieveResponse(query="[recent]", results=memories, count=len(memories))


@app.get("/api/search-tags", response_model=RetrieveResponse)
async def search_by_tags(tag: str, limit: int = 20):
    """Search memories by tag (supports comma-separated tags)"""
    if not supabase:
        raise HTTPException(503, "Supabase not configured")

    if limit < 1 or limit > 50:
        limit = 20

    # Support comma-separated tags: "elwaiele,decision" → matches ALL
    tags = [t.strip().lower() for t in tag.split(",") if t.strip()]
    if not tags:
        raise HTTPException(400, "No tags provided")

    # Build query with @> (array contains) for each tag
    query = supabase.table(TABLE_NAME).select("*")
    for t in tags:
        query = query.contains("tags", [t])
    
    result = query.order("created_at", desc=True).limit(limit).execute()

    memories = []
    for row in (result.data or []):
        memories.append(MemoryItem(
            id=row["id"],
            content=row["content"],
            compressed=row.get("compressed"),
            source=row.get("source", "unknown"),
            tags=row.get("tags", []),
            metadata=row.get("metadata"),
            similarity=None,
            created_at=row.get("created_at", datetime.now()),
        ))

    log.info(f"§ Found {len(memories)} memories with tags: {tags}")

    return RetrieveResponse(query=f"[tags:{','.join(tags)}]", results=memories, count=len(memories))


@app.post("/api/compress", response_model=CompressResponse)
async def compress_text(req: CompressRequest):
    """Compress text using §Codec"""
    compressed = codec.compress(req.text, req.variables)
    savings = codec.estimate_savings(req.text, compressed)

    return CompressResponse(
        original=req.text,
        compressed=compressed,
        savings=savings,
    )


@app.post("/api/decompress", response_model=DecompressResponse)
async def decompress_text(req: DecompressRequest):
    """Decompress §Codec text back to natural language"""
    decompressed = codec.decompress(req.compressed)

    return DecompressResponse(
        compressed=req.compressed,
        decompressed=decompressed,
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """System health check"""
    sb_ok = supabase is not None
    embed_ok = embedder is not None

    return HealthResponse(
        status="ok" if (sb_ok and embed_ok) else "degraded",
        version="0.1.0",
        supabase_connected=sb_ok,
        embeddings_available=embed_ok,
    )


# ═══════════════════════════════════════════════════════════
# RUN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
