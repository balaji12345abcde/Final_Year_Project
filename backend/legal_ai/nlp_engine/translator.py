from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor

# 🔥 CACHE (IN-MEMORY)
TRANSLATION_CACHE = {}

# =========================
# 🔥 CHUNK TEXT
# =========================
def chunk_text(text, chunk_size=3000):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


# =========================
# 🔥 TRANSLATE CHUNK
# =========================
def translate_chunk(chunk, lang):
    try:
        return GoogleTranslator(source='auto', target=lang).translate(chunk)
    except:
        return chunk


# =========================
# 🔥 MAIN FUNCTION (FAST)
# =========================
def translate_text(text, lang):

    cache_key = f"{hash(text)}_{lang}"

    # ✅ CACHE HIT
    if cache_key in TRANSLATION_CACHE:
        return TRANSLATION_CACHE[cache_key]

    chunks = chunk_text(text)

    # 🔥 PARALLEL TRANSLATION
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(lambda c: translate_chunk(c, lang), chunks))

    translated_text = " ".join(results)

    # ✅ SAVE CACHE
    TRANSLATION_CACHE[cache_key] = translated_text

    return translated_text