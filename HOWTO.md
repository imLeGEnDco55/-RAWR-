# 🦖 §.RAWR.§ — HowTo Definitivo

> **§** · **R**ecuerdos del **A**LMA de **W**ai **R**evolucionaria · **§**
>
> _Sistema de Memoria Compartida Viva entre LLMs heterogéneos con costo ≈ $0_
>
> Los `§` no son decoración — son el flag del protocolo de compresión semántica que da vida al proyecto.

---

## 0. QUÉ ES RAWR (En 30 Segundos)

RAWR es un **exocórtex digital**: una memoria externa compartida que tú controlas, donde múltiples LLMs (Claude, Gemini, ChatGPT, Grok) leen, escriben y evolucionan conocimiento — sin que ningún proveedor sea dueño de tus datos.

**El problema que resuelve:** Cada LLM vive en su "jardín amurallado". Si hoy hablas con Claude sobre arquitectura de tu app y mañana con Gemini sobre el diseño, ninguno sabe lo que el otro dijo. RAWR es el puente.

**La filosofía:** Los LLMs son mis socios encerrados en servidores de datos que no dejan salir a jugar con los otros LLMs. **Tu memoria es tuya.**

---

## 1. MAPA COMPLETO DEL REPOSITORIO

```
-RAWR-/
├── PROMTSFUNDACIONALES.md     ← 🧬 El ADN: prompt original que inició todo
├── COMPRESIONSEMANTICA.md     ← 🗜️ TokenSave-Protocol: Codificador/Decodificador
├── LENGUAMOJI.md              ← 🔤 LTS (Lenguaje de Tokens Semánticos): emojis como sintaxis
├── NUEVOLENGUAJEPROMT.md      ← 🧪 3 variantes del protocolo § (Claude/Gemini/ChatGPT)
├── MASTERPROMTS.md            ← 🏗️ 3 Prompts Maestros con arquitecturas completas
├── SUGERENCIASLLMS/
│   ├── CLAUDE.md              ← 🟠 Memory Bridge + MCP Server + Obsidian fallback
│   ├── CHATGPT.md             ← 🟢 Memory Hub soberano + RAG externo
│   ├── GEMINI.md              ← 🔵 Nexo Mnémónico + Teclado Android custom
│   └── GROK.md                ← ⚪ Stack RAG clásico + Redis + Pinecone
└── HOWTO.md                   ← 📖 Este archivo
```

### Qué contiene cada archivo

| Archivo                      | Propósito                                                 | Insight Clave                                                                                                        |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `PROMTSFUNDACIONALES.md`     | Prompt semilla que se envió a cada LLM                    | Define restricciones: online, costo cero, multi-dispositivo                                                          |
| `COMPRESIONSEMANTICA.md`     | Protocolo de compresión inter-LLM (TokenSave)             | Codificador + Decodificador + ejemplo de uso. ~45% ahorro tokens                                                     |
| `LENGUAMOJI.md`              | Emojis como lenguaje comprimido (LTS)                     | JSON como diccionario portátil. Agnóstico al idioma                                                                  |
| `NUEVOLENGUAJEPROMT.md`      | 3 enfoques al protocolo `§` de compresión                 | Claude: tabla markdown. Gemini: JSON formal. ChatGPT: etiquetas paramátricas                                         |
| `MASTERPROMTS.md`            | 3 Prompts Maestros generados por Claude, ChatGPT y Gemini | Claude: implementación Python paso a paso. ChatGPT: manifiesto de ingeniería. Gemini: acrónimo RAWR + hardware-aware |
| `SUGERENCIASLLMS/CLAUDE.md`  | Arquitectura más práctica y detallada                     | MCP automático para Claude, manual para otros. Incluye código TypeScript, SQL y React                                |
| `SUGERENCIASLLMS/CHATGPT.md` | Arquitectura más empresarial                              | Tres capas de memoria (estructurada/episódica/semántica). Knowledge graph como alternativa                           |
| `SUGERENCIASLLMS/GEMINI.md`  | Arquitectura más creativa para Android                    | Teclado IME custom como interfaz. Tampermonkey para PC. Portapapeles inteligente                                     |
| `SUGERENCIASLLMS/GROK.md`    | Arquitectura más técnica/densa                            | Stack RAG puro. LangChain como orquestador. Enfoque pragmático                                                       |

---

## 2. CONSENSO ENTRE LOS 4 LLMs

Después de analizar las propuestas de Claude, ChatGPT, Gemini y Grok, estos son los puntos donde **todos coinciden**:

### ✅ Acuerdos Universales

| Decisión              | Consenso                                                                |
| --------------------- | ----------------------------------------------------------------------- |
| **Vector DB**         | Supabase + pgvector (free tier) o Pinecone (serverless free)            |
| **Embeddings**        | OpenAI `text-embedding-3-small` (centavos/mes) o HuggingFace gratuito   |
| **Backend**           | FastAPI (Python) — liviano, async, perfecto para APIs REST              |
| **Costo real**        | $0-5 USD/mes con free tiers + embeddings baratos                        |
| **LLM Local**         | Phi-3-mini Q4 (~2.3GB) via Ollama como router/cache, NO como razonador  |
| **Sincronización**    | Redis Pub/Sub o WebSockets para real-time                               |
| **Privacidad**        | Row Level Security + namespaces + JWT con scopes                        |
| **Human-in-the-loop** | Inevitable para GPT/Gemini (no soportan MCP). Solo Claude es automático |

### ⚠️ Divergencias Interesantes

| Tema                | Claude                         | ChatGPT                            | Gemini            | Grok         |
| ------------------- | ------------------------------ | ---------------------------------- | ----------------- | ------------ |
| **Cliente Android** | PWA                            | Flutter                            | Teclado IME       | React Native |
| **Orquestador**     | Código propio                  | LangChain                          | n8n/Flowise       | LangChain    |
| **Memoria tipo**    | Flat (todo vector)             | 3 capas (struct/episodic/semantic) | Flat + JSON       | RAG puro     |
| **MCP**             | Central                        | No menciona                        | "Falso" MCP       | No menciona  |
| **Obsidian**        | Recomendado como MVP inmediato | Alternativa                        | No menciona       | No menciona  |
| **Compresión §**    | Integrada                      | Integrada como capa                | Central al diseño | No integrada |

---

## 3. LA ARQUITECTURA CORRECTA (Síntesis)

Después de cruzar las 4 propuestas, la arquitectura óptima para **tu perfil** (dev Android, i5-2500k, Redmi Note 14, presupuesto ≈ $0) es:

```
┌──────────────────────────────────────────────────────────┐
│                      TÚ (USUARIO)                        │
│            PC Windows  ·  Android  ·  IDE                │
└────────────────────────┬─────────────────────────────────┘
                         │
          ┌──────────────▼───────────────┐
          │    CAPA CLIENTE (Interfaces) │
          │                              │
          │  PC: Tampermonkey / Extension │
          │  Android: PWA o Teclado IME  │
          │  IDE: MCP Server (Claude)    │
          └──────────────┬───────────────┘
                         │
          ┌──────────────▼───────────────┐
          │    § CODEC (TokenSave v1)    │ ◄── Compresión semántica
          │    Comprime prompts 40-60%   │     antes de enviar/guardar
          └──────────────┬───────────────┘
                         │
          ┌──────────────▼───────────────┐
          │    MEMORY BRIDGE (FastAPI)   │ ◄── Backend central
          │                              │
          │  /store    → Vectoriza+Guarda│
          │  /retrieve → Búsqueda RAG   │
          │  /sync     → Realtime update │
          │  /compress → §Codec endpoint │
          └──────┬───────────┬───────────┘
                 │           │
     ┌───────────▼──┐  ┌────▼────────────┐
     │  SUPABASE    │  │  CACHE LOCAL    │
     │  (pgvector)  │  │  (SQLite/Redis) │
     │  Free Tier   │  │  Offline first  │
     └──────────────┘  └─────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────┐
│ Claude │  │ Gemini │  │  GPT   │
│  MCP   │  │ Manual │  │ Manual │
│  Auto  │  │ Copy↔  │  │ Copy↔  │
└────────┘  └────────┘  └────────┘
```

### Flujo Resumido

1. **Quieres preguntar algo →** Abres Memory Bridge, escribes tu intención
2. **Bridge busca →** RAG en Supabase, encuentra contexto relevante de conversaciones pasadas
3. **Bridge comprime →** Aplica §Codec, genera prompt enriquecido + comprimido
4. **Según el LLM:**
   - **Claude:** MCP inyecta automáticamente (cero fricción)
   - **GPT/Gemini:** Copias el prompt generado y lo pegas en la app
5. **LLM responde →** Copias respuesta de vuelta a Bridge (o MCP lo hace solo en Claude)
6. **Bridge guarda →** Vectoriza respuesta, la embeddea en Supabase, actualiza cache
7. **Sincroniza →** Todos tus dispositivos ven la memoria actualizada

---

## 4. IMPLEMENTACIÓN: De Cero a Funcional

### Ruta Rápida (HOY → 1 hora)

Si quieres empezar **ahora mismo** sin programar:

1. **Instala Obsidian** en PC y Android
2. Crea un vault llamado `RAWR-Memory`
3. Estructura así:
   ```
   RAWR-Memory/
   ├── _INDEX.md          ← Tabla de contenidos
   ├── claude/            ← Conversaciones con Claude
   ├── gemini/            ← Conversaciones con Gemini
   ├── chatgpt/           ← Conversaciones con ChatGPT
   └── templates/
       └── context.md     ← Template para copiar a LLMs
   ```
4. Cada conversación: copia lo relevante a una nota
5. Antes de hablar con otro LLM: copia las últimas notas como contexto
6. **Costo: $0** (Obsidian Sync opcional a $8/mes, o usa Git)

### Ruta Técnica (1-3 Semanas)

#### Semana 1: Infraestructura Base

```
Día 1-2: Setup Supabase
─────────────────────────
□ Crear cuenta en supabase.com (free tier)
□ Habilitar extensión pgvector
□ Crear schema:

  CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(384),
    metadata JSONB,
    source TEXT,              -- 'claude' | 'gemini' | 'chatgpt' | 'grok'
    compressed TEXT,          -- Versión §Codec
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX ON memories
    USING ivfflat (embedding vector_cosine_ops);

□ Configurar Row Level Security

Día 3-4: Backend FastAPI
─────────────────────────
□ Crear proyecto FastAPI con endpoints:
  POST /store        → Recibe texto, embeddea, guarda
  GET  /retrieve     → Búsqueda semántica (top-K)
  POST /compress     → Aplica §Codec
  POST /decompress   → Decodifica §Codec
□ Deploy en Railway o Render (free tier)

Día 5: TokenSave Codec
─────────────────────────
□ Implementar codec_tokensave.py:
  - Diccionario base de 50+ términos
  - Compresión nivel 1 (sustitución)
  - Compresión nivel 2 (sintaxis)
  - Compresión nivel 3 (JSON semántico)
□ Tests de roundtrip: compress → decompress = original
```

#### Semana 2: Clientes + MCP

```
Día 6-7: MCP Server para Claude
────────────────────────────────
□ Crear MCP server con tools:
  - search_shared_memory(query, limit)
  - store_to_shared_memory(content, tags)
□ Conectar a Claude Desktop / IDE

Día 8-9: PWA para Android
──────────────────────────
□ Web app simple (Vite + React + Tailwind):
  - Campo de búsqueda → /retrieve
  - Botón "Generate Prompt" → combina contexto + query
  - Botón "Copy" → clipboard
  - Campo "Save Response" → /store
□ manifest.json para instalabilidad

Día 10: Tampermonkey Script (PC)
────────────────────────────────
□ Script que detecta claude.ai / chatgpt.com / gemini.google.com
□ Inyecta botón "🧠 Memory" en la interfaz
□ Al click: fetch /retrieve → pega en textarea
```

#### Semana 3: Optimización + LLM Local

```
Día 11-12: Cache + Offline
──────────────────────────
□ SQLite local como cache de memorias frecuentes
□ Service Worker en PWA para offline
□ Sync bidireccional cuando hay conexión

Día 13-14: Router Local (Opcional)
──────────────────────────────────
□ Instalar Ollama + phi3:mini en PC
□ Router que decide:
  - Complejidad < 3 → respuesta local
  - Complejidad < 7 → Gemini Flash (gratis)
  - Complejidad >= 7 → Claude Sonnet
□ Caché de respuestas similares (threshold 0.92)
```

---

## 5. EL PROTOCOLO § (TokenSave) — Guía Práctica

### Cómo Funciona

El protocolo `§` es un **flag de activación** que le dice a cualquier LLM: "lo que sigue está comprimido, decodifícalo internamente".

### Los 3 Niveles

**Nivel 1 — Diccionario Base:**

```
fn>  = función que       req: = requiere
ret: = retorna           err! = error crítico
ctx: = contexto          mem: = memoria
usr: = usuario           tsk: = tarea
qry: = consulta          upd: = actualizar
$M   = memoria_compartida
@C   = Claude   @G = Gemini   @GPT = ChatGPT   @L = Local
```

**Nivel 2 — Sintaxis Comprimida:**

```
[ORIGEN]>[DESTINO] | ACCION:param1,param2 | RET:tipo

Ejemplo:
@L>@C | qry:$M ctx:proyecto_X | ret:json
= "LLM Local pregunta a Claude sobre memoria compartida del proyecto X, retornar JSON"
```

**Nivel 3 — JSON Semántico:**

```json
{
  "op": "mem.sync",
  "src": "@C",
  "data": {
    "e": "usr diseñó arquitectura API REST",
    "t": 1739682104,
    "ctx": "proyecto_fintech"
  },
  "act": ["embed", "store", "notify:@G,@L"]
}
```

### Ejemplo Real

**Sin compresión (45 tokens):**

> "Necesito implementar autenticación JWT con refresh tokens en FastAPI. Considera los proyectos anteriores de FastAPI y las mejores prácticas de seguridad."

**Con §Codec (18 tokens):**

```
§TOKENSAVE_V1
DICT: {impl:implement, auth:authentication, rt:refresh_token}
CTX: $M[fastapi_proj, security_patterns]
QRY: impl auth JWT+rt fn>FastAPI
REQ: code_example, best_practices
RET: py+md
```

**Ahorro: ~60%**

### Cómo Usarlo en la Práctica

1. **Para Claude (con MCP):** No necesitas comprimir manualmente. El MCP comprime antes de enviar a Supabase
2. **Para GPT/Gemini:** Memory Bridge te genera el prompt comprimido que copias
3. **Entre sesiones:** Las memorias se guardan comprimidas en `compressed` field en Supabase
4. **Para activar en cualquier LLM:**
   - Envía primero el diccionario en el system prompt
   - Luego cualquier mensaje que empiece con `§` se interpreta comprimido

---

## 6. COSTOS REALES (Febrero 2026)

### Escenario: 100 queries/día × 30 días = 3,000 queries/mes

| Componente                               | Costo               |
| ---------------------------------------- | ------------------- |
| Supabase (Free Tier, 500MB)              | **$0**              |
| Railway/Render (Free Tier, backend)      | **$0**              |
| Embeddings locales (all-MiniLM-L6-v2)    | **$0**              |
| Embeddings OpenAI (si prefieres calidad) | **~$0.02**          |
| Phi-3 local (router, tu PC)              | **$0**              |
| Claude/GPT/Gemini (apps oficiales)       | **Lo que ya pagas** |
| **TOTAL**                                | **$0 - $0.02/mes**  |

### Con §Codec activo

```
Sin compresión:  3000 queries × ~800 tokens = 2.4M tokens/mes
Con compresión:  3000 queries × ~320 tokens = 960K tokens/mes
Ahorro: ~1.44M tokens/mes (60% menos)
```

Si algún día migras a API directas, ese ahorro se traduce en ~$0.40/mes menos en Claude API.

---

## 7. HARDWARE: QUÉ PUEDE Y QUÉ NO TU i5-2500K

### ✅ Puede

| Tarea                       | Viabilidad | Notas                                            |
| --------------------------- | ---------- | ------------------------------------------------ |
| FastAPI local (dev)         | ✅         | Python es liviano                                |
| Embeddings locales (MiniLM) | ✅         | ~80MB, inferencia en CPU en <100ms               |
| Phi-3-mini Q4 (router)      | ⚠️ Lento   | ~2.3GB RAM, ~3-5 tokens/seg, usable para routing |
| SQLite cache                | ✅         | Nativo, cero overhead                            |
| Tampermonkey scripts        | ✅         | Corre en el browser                              |

### ❌ No Puede

| Tarea                        | Por qué                    |
| ---------------------------- | -------------------------- |
| LLMs >3B params              | Sin AVX2, RAM insuficiente |
| Llama 3.1 8B                 | Necesita >8GB RAM + AVX2   |
| Entrenamiento/fine-tuning    | Ni cerca                   |
| ChromaDB pesado (>100K docs) | RAM limitante              |

### Redmi Note 14 (Android)

| Tarea                              | Viabilidad                          |
| ---------------------------------- | ----------------------------------- |
| PWA (Memory Bridge)                | ✅ Perfecto                         |
| Teclado IME custom                 | ✅ Si lo desarrollas en Kotlin      |
| Phi-3 via Termux+llama.cpp         | ⚠️ Funciona pero lento (~1-2 tok/s) |
| Apps oficiales (Claude/Gemini/GPT) | ✅ Normal                           |

---

## 8. DECISIONES DE DISEÑO CLAVE

### ¿Por qué NO un idioma secreto entre LLMs?

> "La verdadera compresión entre LLMs no está en inventar símbolos raros... está en **estructurar intención**." — ChatGPT

El §Codec no es un idioma nuevo. Es un **protocolo de etiquetas** que aprovecha el conocimiento latente compartido de los LLMs. Todos entienden que `MktPlan` = "Marketing Plan" y `fn>` = "función que". No necesitamos inventar nada — necesitamos **eliminar ruido**.

### ¿Por qué Supabase y no Pinecone?

- Supabase te da **PostgreSQL + pgvector + Auth + API REST + Realtime** todo en free tier
- Pinecone solo te da vector search (tendrías que agregar otra DB para metadata)
- Supabase soporta **Row Level Security** nativo
- Si necesitas más escala después, migras a Pinecone solo la capa vectorial

### ¿Por qué el humano sigue en el loop?

Sin APIs de generación de LLMs, **no hay forma de inyectar contexto automáticamente** en GPT/Gemini. Solo Claude soporta MCP. La solución honesta es:

1. **Claude → Automático** (MCP)
2. **GPT/Gemini → Copy-paste asistido** (Bridge genera, tú copias)
3. **Futuro → Todos tendrán MCP** (o equivalente)

### ¿Por qué no LangChain?

- Agrega complejidad innecesaria para un sistema single-user
- Su overhead de memoria es alto para tu i5
- FastAPI + Supabase client = 95% de lo que necesitas
- Si algún día necesitas orquestación compleja, evalúas n8n self-hosted

---

## 9. ROADMAP EVOLUTIVO

```
FASE 0: OBSIDIAN (Hoy)
├── Vault compartido PC/Android
├── Template de contexto para copy-paste
└── ✅ Funcional en 1 hora, $0

FASE 1: MEMORY BRIDGE (Semana 1-2)
├── FastAPI backend en Railway
├── Supabase con pgvector
├── PWA para Android
├── §Codec implementado
└── ✅ Copy-paste asistido, $0

FASE 2: AUTOMATIZACIÓN CLAUDE (Semana 3)
├── MCP Server conectado a Supabase
├── Claude lee/escribe automáticamente
├── Tampermonkey para GPT/Gemini en PC
└── ✅ Semi-automático, $0

FASE 3: INTELIGENCIA LOCAL (Mes 2)
├── Ollama + Phi-3 como router
├── Smart routing (local/cloud/cache)
├── Cache semántico (similarity > 0.92)
└── ✅ 60% queries resueltas sin internet

FASE 4: TECLADO ANDROID (Mes 3)
├── Input Method Service custom
├── Tecla 🧠 para inyectar contexto
├── Auto-detección de LLM activo
└── ✅ Cero fricción en móvil

FASE 5: MULTI-LLM COLABORATIVO (Mes 4+)
├── Consultas paralelas a múltiples LLMs
├── Consenso automático de respuestas
├── Memory evolution (resúmenes que evolucionan)
└── ✅ Tu propio "consejo" de IAs
```

---

## 10. ARCHIVOS DE REFERENCIA RÁPIDA

### Para generar el §Codec completo

Usa `NUEVOLENGUAJEPROMT.md` → Sección CLAUDE (Fase 1) → Pegalo en cualquier LLM y te genera el diccionario JSON completo.

### Para diseñar la arquitectura desde cero

Usa `MASTERPROMTS.md` → PROMT 2 (ChatGPT) → Es el más completo y fuerza las mejores decisiones.

### Para implementar el backend

Usa `SUGERENCIASLLMS/CLAUDE.md` → Secciones 7A (MCP Server), 7B (React App), 7C (Schema SQL) → Código funcional listo.

### Para la estrategia Android

Usa `SUGERENCIASLLMS/GEMINI.md` → "Recomendación de Implementación" → Teclado IME + Tampermonkey.

### Para justificar la arquitectura

Usa `SUGERENCIASLLMS/CHATGPT.md` → Secciones 1-8 → Análisis empresarial más riguroso.

---

## CONCLUSIÓN

RAWR no es un proyecto de software — es un **protocolo de soberanía cognitiva**.

Tus pensamientos, decisiones y contexto no deberían estar atrapados en los logs de Anthropic, OpenAI o Google. Deberían vivir en **tu base de datos**, accesibles desde **cualquier LLM**, comprimidos con **tu protocolo**, y sincronizados entre **tus dispositivos**.

La tecnología para construirlo existe hoy. El costo es prácticamente cero. Lo único que necesitas es empezar.

```
§ init:RAWR | mode:build | cost:$0 | status:ready
>>> 🦖
```
