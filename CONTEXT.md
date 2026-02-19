# §.RAWR.§ — CONTEXT.md

> Recuerdos del ALMA de Wai Revolucionaria
> Source of truth del proyecto. Actualizado por AI agents.
> Última actualización: 2026-02-19 00:00 CST

## Estado Actual: 🟢 Backend + MCP FUNCIONAL — Verificado Día 2

## Stack Definido

| Componente       | Tecnología                                       | Estado                   |
| ---------------- | ------------------------------------------------ | ------------------------ |
| Backend API      | Python + FastAPI                                 | ✅ HECHO y verificado    |
| Base de datos    | Supabase + pgvector (Free Tier)                  | ✅ Conectado y con datos |
| Embeddings       | Local `all-MiniLM-L6-v2` (384 dims, offline, $0) | ✅ Funcionando           |
| §Codec           | Python, diccionario 60+ términos                 | ✅ Implementado          |
| MCP Server       | TypeScript (MCP SDK)                             | ✅ Compilado y listo     |
| Chrome Extension | JS vanilla + Manifest V3                         | ✅ HECHO (Load Unpacked) |
| Android Keyboard | Kotlin IME                                       | ✅ Scaffolding listo     |

## Verificación Día 2 (2026-02-19)

| Test                              | Resultado                                       |
| --------------------------------- | ----------------------------------------------- |
| `/api/health`                     | ✅ `status: ok`, supabase+embeddings conectados |
| `/api/store` (POST)               | ✅ Memoria guardada ID `d17344dd`               |
| `/api/recent` (GET)               | ✅ 2 memorias: Día 1 + Día 2                    |
| `/api/retrieve` (semantic search) | ✅ RPC `match_memories` funcional               |
| §Codec compression                | ✅ Compresión automática al guardar             |
| MCP Server `dist/index.js`        | ✅ Compilado, 4 tools definidas                 |

## Datos en Supabase

| ID (corto) | Source | Contenido                    | Fecha      |
| ---------- | ------ | ---------------------------- | ---------- |
| `45571b1c` | manual | Primera memoria de RAWR!     | 2026-02-16 |
| `d17344dd` | mcp    | Día 2: MCP Server verificado | 2026-02-19 |

## Archivos del Backend

```
backend/
├── main.py              ← FastAPI app (6 endpoints)
├── models.py            ← Pydantic request/response schemas
├── codec.py             ← §Codec compress/decompress engine
├── requirements.txt     ← fastapi, uvicorn, supabase, httpx, pydantic, python-dotenv
├── .env                 ← Configuración con credenciales Supabase
└── supabase_setup.sql   ← SQL para crear tabla + índice + función RPC
```

## API Endpoints

| Método | Ruta                            | Descripción                                | Verificado |
| ------ | ------------------------------- | ------------------------------------------ | ---------- |
| POST   | `/api/store`                    | Guarda memoria (embed + compress + insert) | ✅         |
| GET    | `/api/retrieve?query=X&limit=5` | Búsqueda semántica en pgvector             | ✅         |
| GET    | `/api/recent?count=10`          | Últimas N memorias                         | ✅         |
| POST   | `/api/compress`                 | Comprime texto con §Codec                  | ✅         |
| POST   | `/api/decompress`               | Decodifica §Codec                          | ⏳         |
| GET    | `/api/health`                   | Status del sistema                         | ✅         |

## Next Steps

1. ~~Setup Supabase~~ ✅
2. ~~Probar backend local~~ ✅
3. ~~Verificar MCP Server~~ ✅
4. **Conectar MCP a Antigravity/Claude** (configurar `mcp.json`)
5. **Chrome Extension**: Testing con Claude/ChatGPT web
6. **Android Keyboard**: Build APK en Android Studio

## Decisiones de Diseño

- **Supabase > Pinecone**: Free tier incluye DB + Auth + API + Realtime. Pinecone solo vectores.
- **Local Embeddings > OpenAI Embeddings**: Gratis sin auth, MiniLM-L6-v2 suficiente para personal use.
- **FastAPI > LangChain**: Menos overhead, i5-2500k no necesita orquestación compleja.
- **§Codec inline**: Compresión automática al guardar, no requiere paso manual.

## Costo Estimado

| Servicio                 | Costo      |
| ------------------------ | ---------- |
| Supabase Free Tier       | $0         |
| Embeddings (local)       | $0         |
| Railway/Render Free Tier | $0         |
| **Total**                | **$0/mes** |
