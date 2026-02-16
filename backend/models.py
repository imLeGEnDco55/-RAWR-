"""
§.RAWR.§ — Pydantic Models for Memory Bridge API
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ═══════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════

class StoreRequest(BaseModel):
    """Store a new memory"""
    content: str = Field(..., min_length=1, max_length=10000, description="Memory content")
    source: str = Field(
        default="manual",
        pattern=r"^(claude|gemini|chatgpt|grok|keyboard|extension|mcp|manual)$",
        description="Origin of this memory"
    )
    tags: list[str] = Field(default_factory=list, description="Categorization tags")
    metadata: Optional[dict] = Field(default=None, description="Extra metadata")


class RetrieveRequest(BaseModel):
    """Search memories semantically"""
    query: str = Field(..., min_length=1, max_length=1000, description="Search query")
    limit: int = Field(default=5, ge=1, le=20, description="Max results")


class CompressRequest(BaseModel):
    """Compress text with §Codec"""
    text: str = Field(..., min_length=1, max_length=10000)
    variables: Optional[dict[str, str]] = Field(
        default=None,
        description="Dynamic variable substitutions"
    )


class DecompressRequest(BaseModel):
    """Decompress §Codec text"""
    compressed: str = Field(..., min_length=1, max_length=5000)


# ═══════════════════════════════════════════════════════════
# RESPONSE MODELS
# ═══════════════════════════════════════════════════════════

class MemoryItem(BaseModel):
    """A single memory entry"""
    id: str
    content: str
    compressed: Optional[str] = None
    source: str
    tags: list[str]
    metadata: Optional[dict] = None
    similarity: Optional[float] = None
    created_at: datetime


class StoreResponse(BaseModel):
    """Response after storing a memory"""
    success: bool
    id: str
    compressed: str
    savings: dict


class RetrieveResponse(BaseModel):
    """Response for semantic search"""
    query: str
    results: list[MemoryItem]
    count: int


class CompressResponse(BaseModel):
    """Response for compression"""
    original: str
    compressed: str
    savings: dict


class DecompressResponse(BaseModel):
    """Response for decompression"""
    compressed: str
    decompressed: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    supabase_connected: bool
    embeddings_available: bool
