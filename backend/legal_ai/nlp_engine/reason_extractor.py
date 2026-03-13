import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download("punkt")

def extract_reason(text, description):

    sentences = nltk.sent_tokenize(text)

    if not sentences:
        return ""

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform(
        [description] + sentences
    )

    scores = cosine_similarity(vectors[0:1], vectors[1:])[0]

    best_index = scores.argmax()

    return sentences[best_index]