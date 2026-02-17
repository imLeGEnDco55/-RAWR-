#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const API_URL = process.env.RAWR_API_URL || "http://localhost:8000/api";

const server = new Server(
  {
    name: "rawr-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ═══════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════

const StoreSchema = z.object({
  content: z.string().min(1).max(10000).describe("The memory content to store"),
  tags: z.array(z.string()).optional().describe("Optional tags for categorization"),
  source: z.enum(["claude", "gemini", "chatgpt", "grok", "mcp"]).default("mcp").describe("Source of this memory"),
});

const RetrieveSchema = z.object({
  query: z.string().min(1).describe("Semantic search query"),
  limit: z.number().int().min(1).max(20).default(5).describe("Max results (1-20)"),
});

const RecentSchema = z.object({
  count: z.number().int().min(1).max(50).default(10).describe("Number of recent memories to fetch"),
});

const CompressSchema = z.object({
  text: z.string().min(1).max(10000).describe("Text to compress using §Codec"),
});

// ═══════════════════════════════════════════════════════════
// TOOLS
// ═══════════════════════════════════════════════════════════

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "store_memory",
        description: "Store a new memory in §.RAWR.§ (automatically embedded & compressed). Use this to save important context, user preferences, or project details.",
        inputSchema: {
          type: "object",
          properties: {
            content: { type: "string", description: "The content to remember" },
            tags: { type: "array", items: { type: "string" }, description: "Tags list" },
            source: { type: "string", enum: ["claude", "mcp"], description: "Source identifier" }
          },
          required: ["content"]
        },
      },
      {
        name: "search_memory",
        description: "Semantically search §.RAWR.§ memory. Use this before answering complex questions to see if relevant context exists.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Natural language query" },
            limit: { type: "number", description: "Max results (default 5)" }
          },
          required: ["query"]
        },
      },
      {
        name: "get_recent_memories",
        description: "Get the most recently added memories. Useful to understand current context or recent updates.",
        inputSchema: {
          type: "object",
          properties: {
            count: { type: "number", description: "Count (default 10)" }
          }
        },
      },
      {
        name: "compress_text",
        description: "Compress text using the §Codec protocol. Useful for reducing token usage when passing context.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to compress" }
          },
          required: ["text"]
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === "store_memory") {
      const { content, tags, source } = StoreSchema.parse(args);
      const resp = await axios.post(`${API_URL}/store`, {
        content,
        tags: tags || [],
        source: source || "mcp",
      });
      return {
        content: [{ type: "text", text: JSON.stringify(resp.data, null, 2) }],
      };
    }

    if (name === "search_memory") {
      const { query, limit } = RetrieveSchema.parse(args);
      const resp = await axios.get(`${API_URL}/retrieve`, {
        params: { query, limit },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(resp.data, null, 2) }],
      };
    }

    if (name === "get_recent_memories") {
      const { count } = RecentSchema.parse(args);
      const resp = await axios.get(`${API_URL}/recent`, {
        params: { count },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(resp.data, null, 2) }],
      };
    }

    if (name === "compress_text") {
      const { text } = CompressSchema.parse(args);
      const resp = await axios.post(`${API_URL}/compress`, { text });
      return {
        content: [{ type: "text", text: JSON.stringify(resp.data, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    const msg = error.response?.data?.detail || error.message;
    return {
      content: [{ type: "text", text: `Error: ${msg}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
