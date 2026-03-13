from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer
import numpy as np

from .act_data import ACT_DATABASE
from .reason_extractor import extract_reason


# Load BERT model
bert_model = SentenceTransformer('all-MiniLM-L6-v2')


def detect_acts_sections(text):

    descriptions = [a["description"] for a in ACT_DATABASE]

    # ---------- TF-IDF ----------
    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(
        [text] + descriptions
    )

    tfidf_scores = cosine_similarity(
        tfidf_matrix[0:1], tfidf_matrix[1:]
    )[0]


    # ---------- BERT ----------
    doc_embedding = bert_model.encode(text)

    section_embeddings = bert_model.encode(descriptions)

    bert_scores = cosine_similarity(
        [doc_embedding],
        section_embeddings
    )[0]


    # ---------- Hybrid Score ----------
    hybrid_scores = (tfidf_scores * 0.5) + (bert_scores * 0.5)

    results = []

    for i, score in enumerate(hybrid_scores):

        if score > 0.15:   # threshold

            act = ACT_DATABASE[i]

            reason = extract_reason(text, act["description"])

            results.append({

                "act": act["act"],
                "section": act["section"],
                "description": act["description"],
                "reason": reason,
                "confidence": float(score)

            })

    # Sort by best match
    results = sorted(
        results,
        key=lambda x: x["confidence"],
        reverse=True
    )

    return results[:5]   