"""
§Codec — Semantic Compression Protocol for §.RAWR.§
Compresses natural language into TokenSave format and back.
Target: 40-60% token reduction for inter-LLM communication.
"""

import re
from typing import Optional

# ═══════════════════════════════════════════════════════════
# LEVEL 1: Core Dictionary (bidirectional)
# ═══════════════════════════════════════════════════════════

DICT_CORE: dict[str, str] = {
    # Actions
    "fn>": "función que",
    "req:": "requiere",
    "ret:": "retorna",
    "err!": "error crítico",
    "impl:": "implementar",
    "upd:": "actualizar",
    "del:": "eliminar",
    "get:": "obtener",
    "set:": "establecer",
    "chk:": "verificar",
    "cmp:": "comparar",
    "gen:": "generar",
    "opt:": "optimizar",
    "cfg:": "configurar",
    "init:": "inicializar",
    "sync:": "sincronizar",
    "auth:": "autenticación",
    "val:": "validar",

    # Entities
    "ctx:": "contexto",
    "mem:": "memoria",
    "usr:": "usuario",
    "tsk:": "tarea",
    "qry:": "consulta",
    "prj:": "proyecto",
    "srv:": "servidor",
    "db:": "base de datos",
    "api:": "interfaz de programación",
    "ui:": "interfaz de usuario",
    "doc:": "documento",
    "cfg:": "configuración",
    "dep:": "dependencia",
    "env:": "entorno",
    "pkg:": "paquete",
    "lib:": "librería",
    "mod:": "módulo",
    "comp:": "componente",
    "feat:": "funcionalidad",

    # LLM Sources
    "@C": "Claude",
    "@G": "Gemini",
    "@GPT": "ChatGPT",
    "@GK": "Grok",
    "@L": "LLM Local",
    "$M": "memoria compartida",

    # Flow
    ">>>": "objetivo final",
    "->": "causa/entonces",
    "=>": "resulta en",
    "<>": "bidireccional",
    "||": "en paralelo",
    "w/": "con",
    "w/o": "sin",

    # Status
    "ok:": "exitoso",
    "fail:": "falló",
    "pend:": "pendiente",
    "wip:": "en progreso",
    "done:": "completado",
}

# Reverse dictionary for decompression
DICT_REVERSE: dict[str, str] = {v.lower(): k for k, v in DICT_CORE.items()}

# ═══════════════════════════════════════════════════════════
# LEVEL 2: Syntax patterns
# ═══════════════════════════════════════════════════════════

# Filler words to strip during compression (Spanish + English)
FILLER_WORDS = {
    "el", "la", "los", "las", "un", "una", "unos", "unas",
    "de", "del", "al", "a", "en", "con", "por", "para",
    "que", "es", "son", "fue", "ser", "está", "están",
    "the", "a", "an", "is", "are", "was", "were", "be",
    "of", "to", "in", "for", "on", "with", "at", "by",
    "this", "that", "it", "from", "as",
    "este", "esta", "estos", "estas", "ese", "eso",
    "como", "pero", "también", "muy", "más",
}


class SectionCodec:
    """§Codec — Semantic Compression Engine"""

    VERSION = "v1.0"
    FLAG = "§"

    def compress(self, text: str, variables: Optional[dict[str, str]] = None) -> str:
        """
        Compress natural language text into §TokenSave format.

        Args:
            text: Natural language input
            variables: Optional dynamic variables {shorthand: full_term}

        Returns:
            Compressed string with § prefix
        """
        result = text.lower()

        # Step 1: Apply dynamic variables (project-specific terms)
        var_block = ""
        if variables:
            var_lines = [f"  {k}={v}" for k, v in variables.items()]
            var_block = "DICT: {" + ", ".join(f"{k}:{v}" for k, v in variables.items()) + "}\n"
            for full, short in variables.items():
                result = result.replace(full.lower(), short)

        # Step 2: Apply core dictionary (longer matches first)
        sorted_dict = sorted(DICT_REVERSE.items(), key=lambda x: len(x[0]), reverse=True)
        for natural, compressed in sorted_dict:
            result = result.replace(natural, compressed)

        # Step 3: Strip filler words
        words = result.split()
        words = [w for w in words if w not in FILLER_WORDS]
        result = " ".join(words)

        # Step 4: Collapse whitespace
        result = re.sub(r"\s+", " ", result).strip()

        # Build output
        header = f"§TOKENSAVE_{self.VERSION}\n"
        body = f"BODY: {result}"

        return header + (var_block if var_block else "") + body

    def decompress(self, compressed: str) -> str:
        """
        Decompress §TokenSave format back to natural language.

        Args:
            compressed: §-prefixed compressed text

        Returns:
            Human-readable natural language
        """
        text = compressed

        # Strip header
        text = re.sub(r"§TOKENSAVE_v[\d.]+\n?", "", text)

        # Extract and apply dynamic variables
        var_match = re.search(r"DICT:\s*\{(.+?)\}\n?", text)
        variables: dict[str, str] = {}
        if var_match:
            var_str = var_match.group(1)
            for pair in var_str.split(","):
                pair = pair.strip()
                if ":" in pair:
                    k, v = pair.split(":", 1)
                    variables[k.strip()] = v.strip()
            text = text.replace(var_match.group(0), "")

        # Strip BODY: prefix
        text = re.sub(r"BODY:\s*", "", text)

        # Apply core dictionary decompression
        sorted_dict = sorted(DICT_CORE.items(), key=lambda x: len(x[0]), reverse=True)
        for compressed_term, natural in sorted_dict:
            text = text.replace(compressed_term, natural)

        # Apply dynamic variables
        for short, full in variables.items():
            text = text.replace(short, full)

        # Clean up spacing
        text = re.sub(r"\s+", " ", text).strip()

        return text

    def estimate_savings(self, original: str, compressed: str) -> dict:
        """Estimate token savings (rough: 1 token ≈ 4 chars for English, 3 for Spanish)"""
        orig_tokens = len(original) / 3.5
        comp_tokens = len(compressed) / 3.5
        saved = orig_tokens - comp_tokens
        pct = (saved / orig_tokens * 100) if orig_tokens > 0 else 0

        return {
            "original_chars": len(original),
            "compressed_chars": len(compressed),
            "estimated_tokens_original": round(orig_tokens),
            "estimated_tokens_compressed": round(comp_tokens),
            "tokens_saved": round(saved),
            "savings_percent": round(pct, 1),
        }


# Singleton
codec = SectionCodec()
