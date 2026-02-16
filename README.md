# 🦖 §.RAWR.§

> **R**ecuerdos del **A**LMA de **W**ai **R**evolucionaria

Tu memoria. Tus reglas. Tus LLMs trabajan para ti.

---

## Qué es

Un **exocórtex digital** — memoria compartida donde tus LLMs (Claude, Gemini, ChatGPT, Grok) leen y escriben conocimiento persistente. Ellos procesan, tú eres dueño de la memoria.

**3 interfaces, 1 memoria:**

| Interfaz                | Plataforma                                | Estado       |
| ----------------------- | ----------------------------------------- | ------------ |
| 🧠 **Memory Bridge**    | Backend API                               | ✅ Funcional |
| 🔌 **MCP Server**       | VS Code / Antigravity                     | ⏳ Próximo   |
| 🌐 **Extensión Chrome** | claude.ai, chatgpt.com, gemini.google.com | ⏳ Próximo   |
| 📱 **Teclado §**        | Android IME                               | ⏳ Próximo   |

## Stack

```
Backend:     Python + FastAPI + Supabase (pgvector)
Embeddings:  sentence-transformers/all-MiniLM-L6-v2 (local, offline, $0)
Compresión:  §Codec (protocolo semántico propio)
MCP:         TypeScript (MCP SDK)
Chrome:      JavaScript vanilla + Manifest V3
Android:     Kotlin IME nativo
```

## Costo mensual: **$0**

| Servicio   | Tier                         |
| ---------- | ---------------------------- |
| Supabase   | Free (500MB DB, 1GB storage) |
| Embeddings | Local (CPU, sin API)         |
| Hosting    | Railway/Render Free          |

## Quickstart

```bash
# 1. Clona
git clone https://github.com/tu-user/RAWR.git
cd RAWR/backend

# 2. Instala
pip install -r requirements.txt

# 3. Configura
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 4. Setup Supabase
# Copia supabase_setup.sql → Supabase SQL Editor → Run

# 5. Arranca
python main.py
# → API en http://localhost:8000
# → Docs en http://localhost:8000/docs
```

## API

```
POST /api/store        → Guarda memoria (embed + compress + insert)
GET  /api/retrieve     → Búsqueda semántica
GET  /api/recent       → Últimas N memorias
POST /api/compress     → §Codec: texto → comprimido
POST /api/decompress   → §Codec: comprimido → texto
GET  /api/health       → Status del sistema
```

## §Codec

El protocolo de compresión semántica de §.RAWR.§ Reduce tokens 40-60% en prompts largos.

```
Input:  "Necesito implementar autenticación JWT con refresh tokens"
Output: "§TOKENSAVE_v1.0\nBODY: req: impl: auth: jwt w/ refresh tokens"
```

## Estructura

```
§.RAWR.§/
├── backend/           ← FastAPI + Supabase ✅
├── mcp-server/        ← MCP para Antigravity/Claude ⏳
├── chrome-extension/  ← Botón § en LLM web apps ⏳
├── android-keyboard/  ← Teclado IME con tecla § ⏳
├── CONTEXT.md         ← Source of truth del proyecto
├── HOWTO.md           ← Guía completa de arquitectura
└── GENESIS_PROMPT.md  ← Prompt para iniciar sesiones AI
```

## Filosofía

Los LLMs son tus socios encerrados en servidores de datos que no dejan salir a jugar con los otros LLMs. **§.RAWR.§ es la llave.**

---

_Built with 🦖 by Wai + sus socios digitales_
