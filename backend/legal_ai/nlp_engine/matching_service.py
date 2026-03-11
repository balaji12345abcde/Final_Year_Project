from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer

from .models import ActSection

import numpy as np


bert_model = SentenceTransformer("all-MiniLM-L6-v2")


def hybrid_match(text):

    acts = ActSection.objects.all()

    descriptions = [a.description for a in acts]

    # TFIDF
    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(descriptions)

    query_tfidf = vectorizer.transform([text])

    tfidf_scores = cosine_similarity(query_tfidf,tfidf_matrix)[0]

    # BERT
    bert_embeddings = bert_model.encode(descriptions)

    query_embedding = bert_model.encode([text])

    bert_scores = cosine_similarity(query_embedding,bert_embeddings)[0]

    # Hybrid score
    final_scores = (tfidf_scores + bert_scores) / 2

    best_index = int(np.argmax(final_scores))

    best_act = acts[best_index]

    return {

        "act_name":best_act.act_name,

        "section_number":best_act.section_number,

        "description":best_act.description,

        "confidence_score":float(final_scores[best_index])

    }