from sklearn.metrics.pairwise import cosine_similarity
from concurrent.futures import ThreadPoolExecutor
from .model_loader import embedder
from .act_data import ACT_DATABASE
from .reason_extractor import extract_reason

# =========================================
# 🔥 PRECOMPUTED EMBEDDINGS
# =========================================
DESCRIPTIONS = [a["description"] for a in ACT_DATABASE]
SECTION_EMBEDDINGS = embedder.encode(DESCRIPTIONS)


# =========================================
# 🔥 FAST CHUNKING
# =========================================
def split_text(text, chunk_size=800):
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]


# =========================================
# 🔥 FAST PROCESS CHUNK (NO NESTED THREADS)
# =========================================
def process_chunk(chunk):

    doc_embedding = embedder.encode(chunk)

    scores = cosine_similarity(
        [doc_embedding],
        SECTION_EMBEDDINGS
    )[0]

    results = []

    for i, score in enumerate(scores):

        if score > 0.15:   # 🔥 slightly stricter

            act = ACT_DATABASE[i]

            # ⚡ call reason only for top matches
            reason = extract_reason(chunk, act["description"])

            results.append({
                "act": act["act"],
                "section": act["section"],
                "description": act["description"],
                "reason": reason,
                "confidence": float(score)
            })

    return results


# =========================================
# 🔥 FINAL FUNCTION
# =========================================
def detect_acts_sections(text):

    chunks = split_text(text)

    all_results = []

    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(process_chunk, chunks))

    for r in results:
        all_results.extend(r)

    unique = {}

    for r in all_results:
        key = (r["act"], r["section"])
        if key not in unique or r["confidence"] > unique[key]["confidence"]:
            unique[key] = r

    return sorted(
        unique.values(),
        key=lambda x: x["confidence"],
        reverse=True
    )[:10]