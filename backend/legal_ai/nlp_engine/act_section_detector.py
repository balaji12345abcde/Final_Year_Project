from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer
import numpy as np

bert = SentenceTransformer("all-MiniLM-L6-v2")


legal_sections = [

"IPC Section 420 cheating fraud deception",
"IPC Section 406 criminal breach of trust",
"IPC Section 121 waging war against government",
"IT Act Section 66 computer related offences",

]


def detect_acts_sections(text):

    # TF-IDF similarity

    vectorizer = TfidfVectorizer()

    corpus = legal_sections + [text]

    tfidf = vectorizer.fit_transform(corpus)

    scores = cosine_similarity(tfidf[-1], tfidf[:-1])[0]


    # BERT similarity

    bert_embeddings = bert.encode(corpus)

    bert_scores = cosine_similarity(
        [bert_embeddings[-1]],
        bert_embeddings[:-1]
    )[0]


    # Hybrid score

    hybrid = (scores + bert_scores) / 2


    top = np.argsort(hybrid)[-3:]


    results = []

    for i in top:

        sec = legal_sections[i]

        parts = sec.split()

        results.append({
            "act": parts[0],
            "section": parts[2]
        })

    return results