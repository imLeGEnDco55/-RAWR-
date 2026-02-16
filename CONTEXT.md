# §.RAWR.§ — CONTEXT.md

> Recuerdos del ALMA de Wai Revolucionaria
> Source of truth del proyecto. Actualizado por AI agents.
> Última actualización: 2026-02-16 04:52 CST

## Estado Actual: 🟢 Backend FUNCIONAL — Siguiente: MCP Server

## Stack Definido

| Componente       | Tecnología                                       | Estado             |
| ---------------- | ------------------------------------------------ | ------------------ |
| Backend API      | Python + FastAPI                                 | ✅ HECHO y probado |
| Base de datos    | Supabase + pgvector (Free Tier)                  | ✅ Configurado     |
| Embeddings       | Local `all-MiniLM-L6-v2` (384 dims, offline, $0) | ✅ Funcionando     |
| §Codec           | Python, diccionario 60+ términos                 | ✅ Implementado    |
| MCP Server       | TypeScript (MCP SDK)                             | ⏳ Siguiente       |
| Chrome Extension | JS vanilla + Manifest V3                         | ⏳ Pendiente       |
| Android Keyboard | Kotlin IME                                       | ⏳ Pendiente       |

## Archivos del Backend

```
backend/
├── main.py              ← FastAPI app (6 endpoints)
├── models.py            ← Pydantic request/response schemas
├── codec.py             ← §Codec compress/decompress engine
├── requirements.txt     ← fastapi, uvicorn, supabase, httpx, pydantic, python-dotenv
├── .env.example         ← Template de configuración
└── supabase_setup.sql   ← SQL para crear tabla + índice + función RPC
```

## API Endpoints

| Método | Ruta                            | Descripción                                |
| ------ | ------------------------------- | ------------------------------------------ |
| POST   | `/api/store`                    | Guarda memoria (embed + compress + insert) |
| GET    | `/api/retrieve?query=X&limit=5` | Búsqueda semántica en pgvector             |
| GET    | `/api/recent?count=10`          | Últimas N memorias                         |
| POST   | `/api/compress`                 | Comprime texto con §Codec                  |
| POST   | `/api/decompress`               | Decodifica §Codec                          |
| GET    | `/api/health`                   | Status del sistema                         |

## Next Steps

1. **Setup Supabase**: Crear proyecto, ejecutar `supabase_setup.sql`, copiar URL+KEY a `.env`
2. **Probar backend local**: `pip install -r requirements.txt && python main.py`
3. **Implementar MCP Server**: Para integración automática con Claude/Antigravity
4. **Chrome Extension**: Botón § para inyectar/guardar memorias desde LLM web apps
5. **Android Keyboard**: Teclado IME con tecla § para inyección de contexto

## Decisiones de Diseño

- **Supabase > Pinecone**: Free tier incluye DB + Auth + API + Realtime. Pinecone solo vectores.
- **HuggingFace > OpenAI Embeddings**: Gratis sin auth, modelo MiniLM es suficiente para personal use.
- **FastAPI > LangChain**: Menos overhead, tu i5-2500k no necesita orquestación compleja.
- **§Codec inline**: La compresión se aplica automáticamente al guardar, no requiere paso manual.

## Costo Estimado

| Servicio                  | Costo      |
| ------------------------- | ---------- |
| Supabase Free Tier        | $0         |
| HuggingFace Inference API | $0         |
| Railway/Render Free Tier  | $0         |
| **Total**                 | **$0/mes** |
