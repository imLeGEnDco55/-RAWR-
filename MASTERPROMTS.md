# PROMT 1: CLAUDE

¡Órale, esto se puso jugoso! 🔥 Básicamente quieres crear el "Sistema Nervioso Central" de tus AIs con presupuesto de estudihambre. Me late, vamos a armar esto.

Primero déjame ser honesto con las limitaciones técnicas (prometo que después viene lo bueno):

**La realidad cruda:**

- Core i5 2500k (2011, 4 cores, sin hyperthreading) + Redmi Note 14 Pro → Podrían correr LLMs de máximo 1-3B parámetros cuantizados (tipo Phi-3 mini, TinyLlama)
- Esos modelos chiquitos son... digamos "limitados" para tareas complejas
- PERO pueden servir como "coordinadores/routers" si los usamos inteligentemente

**La jugada maestra:**
Hybrid Multi-Tier Architecture con lenguaje comprimido. Déjame armarte el prompt maestro:

---

# 🧠 PROMPT MAESTRO: SISTEMA DE MEMORIA COMPARTIDA INTER-LLM (ZERO-COST EDITION)

```markdown
## ROL

Actúas como Arquitecto de Sistemas Distribuidos de IA especializado en:

- Infraestructura de costo cero/mínimo
- Memoria compartida entre LLMs heterogéneos
- Protocolos de compresión semántica
- Sistemas híbridos online-local

## CONTEXTO DEL PROYECTO

Diseñar un ecosistema donde:

- **LLMs Cloud** (Claude/GPT/Gemini): Realizan tareas complejas
- **LLM Local micro** (Phi-3/TinyLlama): Actúa como router/coordinador en dispositivos limitados
- **Memoria compartida**: Base de conocimiento acumulativa sincronizada
- **TokenSave Protocol**: Lenguaje comprimido para minimizar costos API
- **Plataformas**: Windows PC (i5-2500k), Android (Redmi Note 14 Pro), IDE con Antigravity Agents

## STACK TECNOLÓGICO (GRATUITO/OPEN SOURCE)

### 1. CAPA DE MEMORIA COMPARTIDA

**Solución Primaria: Supabase (Free Tier) + pgvector**

- PostgreSQL con extensión vectorial (gratuita hasta 500MB)
- 2 conexiones simultáneas (suficiente para tu uso)
- API REST automática
- Row Level Security para privacidad

**Alternativa**: ChromaDB self-hosted en Railway/Render (free tier)

### 2. EMBEDDINGS (Conversión texto → vectores)

**Opción A**: `text-embedding-3-small` de OpenAI (~$0.02/1M tokens)
**Opción B**: `all-MiniLM-L6-v2` via HuggingFace Inference API (GRATUITO)
**Opción C**: Modelo local `all-MiniLM-L6-v2` (~80MB, corre en tu i5)

### 3. LLM COORDINADOR LOCAL

**Phi-3-mini-4k-instruct** (3.8B parámetros, cuantizado Q4 ~2.3GB RAM)

- Corre en tu i5 2500k via Ollama o llama.cpp
- En Android via Termux + llama.cpp (usa GPU Snapdragon)
- **Función**: Router de contexto, NO razonamiento pesado

### 4. PROTOCOLO DE COMPRESIÓN (TokenSave)

Sistema de 3 niveles:

**NIVEL 1 - Diccionario Base** (50 términos):
```

// DICT_CORE v1.0
fn> = función_que
req: = requiere
ret: = retorna
ctx: = contexto
mem: = memoria
usr: = usuario
tsk: = tarea
qry: = consulta
upd: = actualizar
$M = memoria_compartida
@C = Claude
@G = Gemini
@L = LLM_Local

```

**NIVEL 2 - Sintaxis Comprimida**:
```

[ORIGEN]>[DESTINO] | ACCION:param1,param2 | RET:tipo

```

Ejemplo:
```

@L>@C | qry:$M ctx:proyecto_X | ret:json

````
Traduce a: "LLM Local pregunta a Claude sobre memoria compartida en contexto del proyecto X, retornar JSON"

**NIVEL 3 - Compresión Semántica Avanzada**:
```json
{
  "op": "mem.sync",
  "src": "@C",
  "data": {
    "e": "usr preguntó sobre arquitectura API",
    "t": 1735689600,
    "ctx": "proyecto_fintech"
  },
  "act": ["embed", "store", "notify:@G,@L"]
}
````

### 5. ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO                            │
│  (Windows/Android/IDE)                               │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │   LLM LOCAL (Phi-3)  │ ◄─── Corre en tus dispositivos
    │   ROUTER/CACHE       │      Decisiones rápidas/offline
    └──────────┬───────────┘
               │
        ┌──────▼──────┐
        │ DECISION     │
        │ ENGINE       │
        └──┬────┬─────┘
           │    │
    ┌──────▼─┐  └──────┐
    │ CACHE  │    ┌────▼────┐
    │ LOCAL  │    │SUPABASE │ ◄─── Memoria compartida online
    └────────┘    │(pgvector)│      (Sincroniza cada 5min)
                  └────┬────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
     ┌────▼───┐   ┌───▼────┐  ┌───▼────┐
     │ Claude │   │ Gemini │  │  GPT   │ ◄─── Solo para tareas complejas
     │  API   │   │  API   │  │  API   │      Usa TokenSave Protocol
     └────────┘   └────────┘  └────────┘
```

### FLUJO DE OPERACIÓN

**Escenario 1: Consulta simple**

```
1. Usuario: "¿Cuál era el endpoint de la API de pagos?"
2. @L (local): Busca en caché local → ENCONTRADO
3. @L: Responde directo (0 tokens consumidos)
```

**Escenario 2: Consulta compleja**

```
1. Usuario: "Diseña la arquitectura de microservicios para el módulo de pagos"
2. @L: Analiza → Necesita razonamiento complejo
3. @L: Busca contexto en $M (Supabase): "proyecto_fintech", "stack_preferido"
4. @L → @C: Envía prompt comprimido con TokenSave
   @L>@C | tsk:arch_design ctx:fintech,microserv | req:$M[stack,constraints] | ret:md+diagram
5. @C: Responde con solución
6. @C → $M: Guarda nuevo conocimiento embedido
7. @L: Entrega resultado a usuario + actualiza caché
```

**Escenario 3: Multi-LLM colaborativo**

```
1. Usuario: "Compara enfoques de autenticación: opinión de 3 LLMs"
2. @L: Identifica tarea paralela
3. @L → [@C, @G, GPT] en paralelo con mismo contexto comprimido
4. @L: Agrega respuestas
5. @L → $M: Guarda consenso/diferencias
```

## ESTRATEGIAS DE COSTO CERO

### A) Minimización de tokens API

```python
# Ejemplo de compresión antes de enviar a Claude
def compress_for_api(prompt_humano, contexto_memoria):
    # Usar diccionario TokenSave
    compressed = tokenizer.compress(prompt_humano)

    # Recuperar solo vectores relevantes (top 3)
    context_embeddings = supabase.query_vectors(
        query=compressed,
        limit=3  # Solo lo esencial
    )

    # Construir prompt final
    final_prompt = f"""
    §COMPRESSED_MODE
    DICT: {DICT_CORE}
    QRY: {compressed}
    CTX: {context_embeddings}
    """

    return final_prompt  # ~60% menos tokens
```

### B) Caché agresivo

```python
# Almacenar respuestas comunes localmente
CACHE_RULES = {
    "ttl": 7*24*3600,  # 1 semana
    "similarity_threshold": 0.92,  # Si pregunta es 92% similar, usar caché
    "hot_topics": ["proyecto_X", "api_docs"]  # Pre-cargar en startup
}
```

### C) Smart Routing

```python
def route_query(query):
    complexity = phi3_local.assess_complexity(query)

    if complexity < 3:  # Escala 1-10
        return "LOCAL"  # Phi-3 puede manejarlo
    elif complexity < 7:
        # Usar el LLM más barato disponible
        return "GEMINI_FLASH"  # Más barato que Claude/GPT
    else:
        return "CLAUDE_SONNET"  # Para tareas críticas
```

## IMPLEMENTACIÓN PASO A PASO

### FASE 1: Setup Infraestructura (Día 1)

```bash
# 1. Supabase (memoria compartida)
- Crear cuenta en supabase.com (free tier)
- Habilitar extensión pgvector
- Crear tabla:
  CREATE TABLE memoria_compartida (
    id UUID PRIMARY KEY,
    contenido TEXT,
    embedding VECTOR(384),  # Tamaño para MiniLM
    metadata JSONB,
    timestamp TIMESTAMP
  );

# 2. Ollama en tu PC (LLM local)
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull phi3:mini
ollama pull nomic-embed-text  # Para embeddings locales

# 3. Android (Termux)
pkg install python rust
pip install llama-cpp-python
# Descargar phi3-mini-4k Q4 (~2.3GB)
```

### FASE 2: TokenSave Protocol (Día 2-3)

```python
# codec_tokensave.py
class TokenSaveCodec:
    def __init__(self):
        self.dict_core = self.load_dictionary()

    def compress(self, text: str) -> str:
        # Implementar compresión según reglas NIVEL 1-3
        pass

    def decompress(self, compressed: str) -> str:
        # Decodificar para humanos si es necesario
        pass
```

### FASE 3: Router Local (Día 4-5)

```python
# local_router.py usando Phi-3
from ollama import chat

def route_and_execute(user_query):
    # 1. Phi-3 analiza query
    analysis = chat(model='phi3:mini', messages=[
        {'role': 'system', 'content': ROUTER_SYSTEM_PROMPT},
        {'role': 'user', 'content': user_query}
    ])

    # 2. Decide: local / caché / API cloud
    decision = parse_routing_decision(analysis)

    # 3. Ejecuta según decisión
    if decision['target'] == 'local':
        return handle_locally(user_query)
    elif decision['target'] == 'cache':
        return query_cache(user_query)
    else:
        return forward_to_cloud(decision['llm'], user_query)
```

### FASE 4: Integración Cross-Platform (Día 6-8)

- **Windows**: Script Python como servicio HTTP local (FastAPI)
- **Android**: App Termux + cron job para sincronización
- **IDE**: Plugin que llama a API local

### FASE 5: Sistema de Sincronización (Día 9-10)

```python
# sync_manager.py
class MemorySyncManager:
    def __init__(self):
        self.local_cache = {}
        self.supabase = create_client(SUPABASE_URL, KEY)

    def sync_bidirectional(self):
        # Cada 5 minutos o cuando hay conexión
        local_changes = get_pending_changes()
        cloud_changes = self.supabase.get_updates_since(last_sync)

        # Merge con conflict resolution
        merged = self.merge_changes(local_changes, cloud_changes)

        # Update ambos lados
        self.update_local(merged)
        self.update_cloud(merged)
```

## PROS Y CONTRAS

### ✅ PROS

- **Costo ~$0-5/mes**: Free tiers + embeddings locales + caché agresivo
- **Funciona offline**: Phi-3 local maneja queries básicas sin internet
- **Memoria persistente**: Todo se guarda en Supabase (pgvector)
- **Multi-plataforma**: Mismo sistema en PC/Android/IDE
- **Escalable**: Puedes agregar más LLMs o cambiar a paid tiers después
- **Privado**: Datos en tu Supabase, no en logs de OpenAI/Anthropic

### ❌ CONTRAS

- **Latencia inicial**: Router local → API cloud agrega ~500ms
- **Setup complejo**: Requiere configurar 5+ servicios
- **Hardware límite**: i5-2500k solo maneja LLMs <3B parámetros
- **Sincronización**: Conflictos pueden ocurrir si editas en 2 dispositivos simultáneamente
- **Dependencia de internet**: Para tareas complejas necesitas conexión

## ALTERNATIVAS

### ALTERNATIVA 1: 100% Cloud (Más simple)

**Stack**: Cloudflare Workers + Vercel + Pinecone free tier
**Pros**: Sin instalar nada localmente, ultra rápido
**Contras**: No funciona offline, menos control

### ALTERNATIVA 2: 100% Local (Más privado)

**Stack**: Llama 3.1 8B + ChromaDB + SQLite
**Pros**: Todo privado, sin costos recurrentes
**Contras**: Tu i5-2500k sufriría, necesitarías GPU

### ALTERNATIVA 3: Hybrid con LangChain

**Stack**: LangChain + LangSmith + Redis
**Pros**: Ecosistema maduro, mucha documentación
**Contras**: Más pesado, curva de aprendizaje

## ESTIMACIÓN DE COSTOS REAL

**Escenario: 100 queries/día durante 30 días**

```
OPCIÓN PROPUESTA:
- Supabase: $0 (free tier)
- Embeddings locales: $0
- Queries manejadas por Phi-3 local (60%): $0
- Queries a Claude API (40 * 30 = 1200 queries):
  * ~500 tokens/query comprimido
  * 1200 * 500 = 600K tokens
  * Input: $0.03 per 1M → $0.018
  * Output: $0.15 per 1M → $0.09
  * TOTAL: ~$0.11/mes 🎉

COMPARADO CON:
- Sin compresión: ~$0.30/mes
- Sin router local: ~$0.50/mes
- Sin caché: ~$1.20/mes
```

## CÓDIGO DE EJEMPLO: Prompt Comprimido

```python
# Ejemplo de uso real del sistema

# 1. Usuario pregunta en tu IDE
user_query = "Necesito implementar autenticación JWT con refresh tokens en FastAPI"

# 2. Router local (Phi-3) procesa
router_response = phi3.analyze(user_query)
# Detecta: Tarea compleja → Requiere Claude
# Busca en memoria: "proyectos FastAPI anteriores"

# 3. Construye prompt comprimido
compressed_prompt = f"""
§TOKENSAVE_V1
DICT: {{fn>:function, impl:implement, auth:authentication, rt:refresh_token}}
CTX: $M[fastapi_proj, security_patterns]
QRY: impl auth JWT+rt fn>FastAPI
REQ: code_example, best_practices
RET: py+md
"""

# 4. Envía a Claude (consume ~300 tokens vs ~800 sin comprimir)
claude_response = anthropic.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": compressed_prompt}]
)

# 5. Guarda respuesta en memoria compartida
embedding = embed_locally(claude_response.content)
supabase.table('memoria_compartida').insert({
    'contenido': claude_response.content,
    'embedding': embedding,
    'metadata': {'topic': 'fastapi_jwt', 'proyecto': 'actual'}
})

# 6. Actualiza caché local
local_cache['fastapi_jwt'] = {
    'response': claude_response.content,
    'timestamp': now(),
    'ttl': 7 * 24 * 3600
}
```

## DIAGRAMA DE DECISIÓN

```
Usuario hace pregunta
    │
    ▼
┌─────────────────┐
│ Phi-3 Router    │ "¿Puedo manejar esto?"
└────────┬────────┘
         │
    ┌────▼────┐
    │ Simple? │ (ej: "qué es JWT?")
    └────┬────┘
         │
    ┌────▼──────┐
    │ SÍ → Local│ → Responde desde Phi-3
    └───────────┘
         │
    ┌────▼─────────┐
    │ NO → ¿Caché? │ "¿Ya pregunté algo similar?"
    └────┬─────────┘
         │
    ┌────▼────────────┐
    │ SÍ → Caché Local│ → Responde (0 costo)
    └─────────────────┘
         │
    ┌────▼──────────┐
    │ NO → Memoria  │ Busca contexto en Supabase
    └────┬──────────┘
         │
    ┌────▼─────────────────┐
    │ Comprime con TokenSave│
    └────┬─────────────────┘
         │
    ┌────▼────────────┐
    │ Elige LLM Cloud │ (Gemini Flash si es barato, Claude si es complejo)
    └────┬────────────┘
         │
    ┌────▼──────┐
    │ Ejecuta   │
    └────┬──────┘
         │
    ┌────▼────────────┐
    │ Guarda respuesta│ → Supabase + Caché Local
    └─────────────────┘
```

## SIGUIENTE PASO INMEDIATO

Si quieres implementar esto, el orden óptimo sería:

**Semana 1: MVP Funcional**

1. Setup Supabase (2 horas)
2. Instalar Ollama + Phi-3 en tu PC (1 hora)
3. Script Python básico que conecte Phi-3 → Claude API (4 horas)
4. Implementar diccionario TokenSave (3 horas)
5. Probar flujo completo con 10 queries de prueba

**Semana 2: Memoria Compartida**

1. Implementar embeddings locales (MiniLM)
2. Sistema de almacenamiento vectorial en Supabase
3. Búsqueda semántica funcionando
4. Sincronización básica

**Semana 3: Cross-Platform**

1. Android con Termux
2. Integración con IDE
3. Sistema de caché robusto

**¿Por dónde quieres que empecemos?** Puedo generarte:

- El código del router con Phi-3
- El schema de Supabase listo para copiar/pegar
- El diccionario TokenSave completo
- O una demo funcional del flujo comprimido

¿Qué parte te urge más? 🚀

```

---

**TL;DR en español**: Básicamente usas tu hardware modesto como "cerebro pequeño" que decide cuándo llamar a los "cerebros grandes" en la nube, con un lenguaje comprimido que te ahorra ~60% en tokens, y todo sincronizado en Supabase gratis. Es como tener un asistente que solo molesta al jefe cuando es realmente necesario 😎

¿Le entramos? Dime qué parte quieres que desarrollemos primero y te armo el código funcional.
```

# PROMT 2: CHATGPT

JAJAJA esto ya no es un prompt… esto es un manifiesto cyber-arquitectónico 😈🧠

Quieres un **Prompt Maestro** que obligue a otro LLM a diseñar una arquitectura de memoria compartida multi-LLM… pero con espíritu hacker-austero: costo ≈ 0, online, escalable, y con la posibilidad real de integrar un micro-LLM que sobreviva en un **Core i5-2500K** y un **Redmi Note 14 4** sin incendiar la RAM 🔥📉.

Además, quieres integrar el archivo `NUEVOLENGUAJEPROMT.md` y el protocolo de compresión tipo § / TokenSave.

Perfecto. Vamos a fabricar algo quirúrgico.

Te entrego el **PROMPT MAESTRO DEFINITIVO**, listo para pegar en otro LLM.

No lo escribiré en tono juguetón. Esto es un artefacto de ingeniería.

---

PROMPT MAESTRO ↓

---

Actúa como un Arquitecto Principal de Infraestructura de IA especializado en:

- Sistemas multi-LLM
- Memoria persistente compartida
- Vector databases
- Arquitecturas RAG
- Optimización de costos extremos
- Integración híbrida cloud + edge

CONTEXTO EXTENDIDO:

Estoy diseñando una infraestructura ONLINE donde múltiples LLMs (Claude, GPT, Gemini y potencialmente modelos open-source) comparten memoria a largo plazo para ofrecer experiencia consistente entre aplicaciones y dispositivos.

El sistema debe permitir:

- Lectura, escritura y edición de memoria
- Sincronización entre:
  - PC Windows
  - Smartphone Android
  - IDE con agentes autónomos

- Integración futura de un LLM ultra-pequeño que pueda correr en:
  - Intel Core i5-2500K
  - Smartphone tipo Redmi Note 14 4

El desarrollo no es limitante porque puede ser generado por un Agente AI.

INCLUYE COMO PARTE DEL DISEÑO:

1. El concepto del archivo adjunto “NUEVOLENGUAJEPROMT.md” (protocolo de compresión inter-LLM tipo § y TokenSave-Protocol).
2. La posibilidad de que los LLMs intercambien mensajes comprimidos para reducir costos de tokens entre APIs comerciales.
3. Una capa opcional de micro-modelo local (ej: Llama.cpp, Mistral 7B quantizado, Phi-3-mini, etc.) como:
   - Filtro previo
   - Cache semántico
   - Compresor/descompresor
   - Agente de sincronización

OBJETIVO:

Diseña una arquitectura implementable HOY (febrero 2026), madura, estable, no especulativa, con enfoque ONLINE, pero optimizada para costo cero o casi cero.

REQUISITOS TÉCNICOS OBLIGATORIOS:

Incluye análisis detallado de:

- RAG (Retrieval-Augmented Generation)
- Bases de datos vectoriales:
  - Pinecone
  - Weaviate
  - Chroma
  - Alternativas open-source auto-hosteables

- APIs de embeddings
- MCP (Model Context Protocol)
- Sistemas de caché (Redis, semantic cache, embedding cache)
- Estrategias de sincronización en tiempo real
- Consistencia eventual vs fuerte
- Control de permisos multiusuario
- Aislamiento lógico por usuario
- Cifrado en tránsito y en reposo
- Costos operativos estimados
- Escalabilidad progresiva

RESTRICCIÓN CRÍTICA:

Optimiza para:

- Costo mensual ≈ 0 USD o mínimo absoluto
- Uso de servicios gratuitos
- Auto-hosting ligero
- Reducción agresiva de llamadas API
- Minimización de tokens vía compresión inter-LLM

FORMATO OBLIGATORIO DE RESPUESTA:

1. Análisis paso a paso de las opciones arquitectónicas disponibles
2. Propuesta de arquitectura técnica concreta (stack específico)
3. Diagrama de flujo simplificado en texto
4. Justificación del rol del micro-LLM local
5. Estrategia de compresión de tokens usando protocolo tipo § / TokenSave
6. Estimación cualitativa de costos
7. Pros y contras
8. 2-3 alternativas viables con trade-offs

Evita soluciones futuristas no disponibles hoy.

No respondas con generalidades. Diseña como si fueras a implementarlo mañana.

---

Ahora… déjame explicarte por qué este prompt está bien armado 🧠

Primero, obliga al modelo a pensar en capas: edge, cloud, memoria, sincronización.

Segundo, introduce el archivo como una pieza funcional real, no decorativa. El protocolo comprimido se vuelve una herramienta de reducción de costos, no solo un experimento lingüístico.

Tercero, fuerza una justificación explícita del micro-LLM. Eso evita que el modelo lo trate como juguete exótico. Lo convierte en:

• pre-processor
• cache semántico
• compresor
• router inteligente

Cuarto, el enfoque “implementable hoy” bloquea la fantasía AGI-eternidad.

Y lo más interesante…
Estás diseñando una arquitectura donde el modelo pequeño no compite con los grandes. Los disciplina. Los filtra. Los hace más baratos 💸⚙️.

Es una especie de orquestador minimalista que vive en hardware humilde pero piensa estratégicamente.

Si quieres, en el siguiente mensaje podemos hacer algo aún más divertido:

Diseñar la versión 0.1 ultra-realista que realmente podrías montar este mes con:

- Docker
- FastAPI
- Chroma local
- Redis
- Llama.cpp quantizado
- Un VPS barato
- Y APIs comerciales solo cuando sea estrictamente necesario

Y lo convertimos en blueprint ejecutable 🚀💾

¿Lo llevamos a arquitectura concreta o quieres afilar aún más el arma? 😏

# PROMT 3: GEMINI

¡Esto se pone cada vez mejor! Estás pidiendo el "Santo Grial" del desarrollo independiente: **Coste Cero + Hardware Legado + Sincronización Nube + Persistencia**.

Para que esto funcione en un i5-2500k (una leyenda del 2011, pero viejo) y un Redmi Note 14, la clave no es la fuerza bruta, sino la **eficiencia extrema**. Aquí es donde el archivo que adjuntaste (`NUEVOLENGUAJEPROMT.md`) se vuelve vital: usaremos la **Compresión Semántica** para que tus dispositivos no transmitan "novelas", sino "paquetes lógicos" que consuman pocos recursos y ancho de banda.

Aquí tienes el **Prompt Maestro**. Copia y pega esto en un modelo de alto razonamiento (como GPT-4o, Claude 3.5 Sonnet o Gemini 1.5 Pro) para que diseñe tu arquitectura.

---

### 📋 PROMPT MAESTRO PARA EL ARQUITECTO DE RAWR

**ROL:**
Actúa como un **Arquitecto de Soluciones de IA Senior** especializado en _Edge Computing_, _Sistemas Distribuidos de Bajo Costo_ y _Optimización de Tokens_.

**PROYECTO:**
Estoy construyendo **RAWR** (**R**epositorio de **A**stucia y **W**it **R**ecurrente).
Es un sistema de **Memoria Compartida Viva** donde múltiples LLMs (Claude, Gemini, GPT) no solo leen, sino que escriben, editan y evolucionan información compartida.

**ESCENARIO DE HARDWARE (EL DESAFÍO):**
El sistema debe ser accesible y funcional desde:

1. **PC Legacy:** Procesador Intel Core i5-2500k (Sin GPU dedicada potente).
2. **Móvil:** Redmi Note 14 (Android).
3. **Entorno:** IDE con agentes "Antigravity".

**RESTRICCIÓN SUPREMA:**
El costo operativo debe ser **$0 o tendiente a cero**.

- No puedo pagar clusters de Kubernetes ni instancias de AWS.
- Debo usar **Free Tiers** (Capas gratuitas) de servicios en la nube.
- Debo usar **SLMs (Small Language Models)** ultra-optimizados para la inferencia local ligera si es necesario.

**INSUMO CRÍTICO (PROTOCOLO DE COMPRESIÓN):**
Para lograr la eficiencia en este hardware, la arquitectura **DEBE** integrar un protocolo de "Compresión Semántica" basado en la siguiente lógica (inspirada en técnicas de token-saving):

- Uso de diccionarios contextuales dinámicos (ej. `§` como flag de compresión).
- Sintaxis tipo JSON/Pseudocódigo para reducir el uso de tokens en un 40-60% durante la sincronización entre el dispositivo y la nube.
- _Referencia:_ Los LLMs no deben "charlar" entre ellos, deben transmitirse estados lógicos comprimidos (ej: `fn>update_mem req:id_55 body:new_data`).

**OBJETIVO DEL DISEÑO:**
Diseña la arquitectura técnica completa para RAWR con un enfoque **Online-First** (Nube como cerebro, Dispositivo como interfaz inteligente).

**TU RESPUESTA DEBE INCLUIR:**

1. **STACK TECNOLÓGICO "COSTO CERO":**

- Define qué **Base de Datos Vectorial Gratuita** usar (ej: Supabase Free Tier con `pgvector`, Pinecone Starter, o Chroma alojado en Render).
- Define qué **API de Inferencia Gratuita** o **SLM Local** usar (ej: Groq Free API, Gemini Flash Free, o un modelo cuantizado Q4_K_M tipo _Phi-3-mini_ o _Gemma-2b_ corriendo en el i5 vía Ollama/Llama.cpp como "router").
- Define el **Orquestador** (¿LangChain? ¿Flowise? ¿n8n self-hosted?).

2. **ARQUITECTURA DE FLUJO DE DATOS (R/W):**

- Explica cómo un Agente en el IDE escribe un dato, este se comprime usando el protocolo "TokenSave", viaja a la nube, y se actualiza en el Android sin que el usuario tenga que refrescar manualmente.
- ¿Cómo manejamos las alucinaciones si el modelo local es pequeño? (Estrategia de verificación).

3. **INTEGRACIÓN DEL PROTOCOLO DE COMPRESIÓN:**

- Detalla en qué punto de la arquitectura se aplica el `§ Codec` (¿En el cliente? ¿En un middleware?).
- Dame un ejemplo de cómo se ve un "paquete de memoria" viajando de RAWR-PC a RAWR-Nube.

4. **SOLUCIÓN A LA PRIVACIDAD Y AISLAMIENTO:**

- Cómo separar mis datos de "trabajo" (IDE) de mis datos "personales" (Android) dentro de la misma infraestructura gratuita.

5. **DIAGRAMA TEXTUAL:**

- Un esquema claro de nodos y conexiones.

**NOTA FINAL:**
No me des generalidades. Dame nombres de herramientas, librerías específicas y configuración recomendada para 2025-2026. Si recomiendas correr algo local en el i5, asegúrate de que sea viable para esa CPU (AVX support, RAM usage).

---

### ¿Por qué este prompt funcionará para ti?

1. **Reconoce la limitación del i5-2500k:** Este procesador no tiene instrucciones AVX2 (que usan los modelos modernos para ir rápido), por lo que el prompt fuerza al arquitecto a sugerir modelos compatibles o delegar todo a APIs gratuitas (como Groq o Gemini Flash).
2. **Integra tu archivo:** No ignora el archivo `NUEVOLENGUAJEPROMT.md`. Lo convierte en la pieza central para ahorrar ancho de banda y latencia, haciendo viable el sistema en un móvil.
3. **Fuerza el Costo Cero:** Exige nombres como Supabase o Render, evitando que te sugieran AWS o Azure que cobran por respiro.

¿Listo para lanzarlo? 🦖
