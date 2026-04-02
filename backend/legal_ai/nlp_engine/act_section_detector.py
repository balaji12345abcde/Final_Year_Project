from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from concurrent.futures import ThreadPoolExecutor
import numpy as np

from .act_data import ACT_DATABASE
from .reason_extractor import extract_reason


# =========================================
# 🔥 LOAD MODEL ONCE (IMPORTANT)
# =========================================
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Preload descriptions
DESCRIPTIONS = [a["description"] for a in ACT_DATABASE]

# 🔥 CACHE embeddings (VERY IMPORTANT for speed)
SECTION_EMBEDDINGS = bert_model.encode(DESCRIPTIONS)


# =========================================
# 🔥 SAFE TEXT (PREVENT TOKEN ERROR)
# =========================================
def safe_text(text, max_words=500):
    words = text.split()
    return " ".join(words[:max_words])


# =========================================
# 🔥 BERT SCORE
# =========================================
def compute_bert_scores(text):

    safe_input = safe_text(text)

    doc_embedding = bert_model.encode(safe_input)

    return cosine_similarity(
        [doc_embedding],
        SECTION_EMBEDDINGS
    )[0]


# =========================================
# 🔥 TF-IDF SCORE
# =========================================
def compute_tfidf_scores(text):

    safe_input = safe_text(text)

    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(
        [safe_input] + DESCRIPTIONS
    )

    return cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:]
    )[0]


# =========================================
# 🔥 MAIN FUNCTION
# =========================================
def detect_acts_sections(text):

    # 🔥 LIMIT THREADS (avoid laptop lag)
    with ThreadPoolExecutor(max_workers=2) as executor:

        tfidf_future = executor.submit(compute_tfidf_scores, text)
        bert_future = executor.submit(compute_bert_scores, text)

        tfidf_scores = tfidf_future.result()
        bert_scores = bert_future.result()

    # 🔥 HYBRID SCORE
    hybrid_scores = (tfidf_scores * 0.4) + (bert_scores * 0.6)

    results = []

    # =========================================
    # 🔥 PROCESS RESULTS
    # =========================================
    def process_result(i):

        score = hybrid_scores[i]

        # 🔥 LOWER THRESHOLD (IMPORTANT FIX)
        if score > 0.08:

            act = ACT_DATABASE[i]

            reason = extract_reason(
                safe_text(text, 1000),  # small text for speed
                act["description"]
            )

            return {
                "act": act["act"],
                "section": act["section"],
                "description": act["description"],
                "reason": reason,
                "confidence": float(score)
            }

        return None

    # 🔥 PARALLEL FILTER
    with ThreadPoolExecutor(max_workers=2) as executor:
        output = list(executor.map(process_result, range(len(hybrid_scores))))

    results = [r for r in output if r]

    # 🔥 SORT & LIMIT
    return sorted(
        results,
        key=lambda x: x["confidence"],
        reverse=True
    )[:5]