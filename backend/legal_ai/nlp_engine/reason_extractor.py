import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#nltk.download("punkt")


# =========================================
# 🔥 FAST SENTENCE LIMIT
# =========================================
def get_top_sentences(text, max_sentences=10):

    sentences = nltk.sent_tokenize(text)

    if len(sentences) <= max_sentences:
        return sentences

    return sentences[:max_sentences]   # 🔥 limit for speed


# =========================================
# 🔥 MAIN FUNCTION
# =========================================
def extract_reason(text, description):

    try:
        sentences = get_top_sentences(text)

        if not sentences:
            return ""

        # 🔥 lightweight vectorizer
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=500
        )

        vectors = vectorizer.fit_transform(
            [description] + sentences
        )

        scores = cosine_similarity(
            vectors[0:1],
            vectors[1:]
        )[0]

        best_index = scores.argmax()

        return sentences[best_index]

    except Exception as e:
        print("Reason error:", e)
        return ""