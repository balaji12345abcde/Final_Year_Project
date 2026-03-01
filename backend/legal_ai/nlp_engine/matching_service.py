from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np
from .models import ActSection as Act
model = SentenceTransformer("all-MiniLM-L6-v2")

def hybrid_match(document_text):
   # adjust import if needed

    acts = Act.objects.all()

    act_texts = [act.description for act in acts]

    # ---------------- TF-IDF ----------------
    vectorizer = TfidfVectorizer()

    # Fit on both acts + document
    tfidf_matrix = vectorizer.fit_transform(act_texts + [document_text])

    act_vectors = tfidf_matrix[:-1]
    doc_vector = tfidf_matrix[-1]

    tfidf_scores = cosine_similarity(doc_vector, act_vectors)[0]

    # ---------------- BERT ----------------
    act_embeddings = model.encode(act_texts)
    doc_embedding = model.encode([document_text])

    bert_scores = cosine_similarity(doc_embedding, act_embeddings)[0]

    # ---------------- HYBRID ----------------
    final_scores = 0.5 * tfidf_scores + 0.5 * bert_scores

    best_index = int(np.argmax(final_scores))

    best_act = acts[best_index]

    return {
        "act_name": best_act.act_name,
        "section_number": best_act.section_number,
        "description": best_act.description,
        "confidence_score": float(final_scores[best_index])
    }