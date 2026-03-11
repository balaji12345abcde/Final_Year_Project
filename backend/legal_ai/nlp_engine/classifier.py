from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

doc_types = {
"Complaint": "complaint police fraud cheating criminal case report",
"Contract": "contract agreement legal obligation parties terms conditions",
"Agreement": "agreement between parties legal agreement signed document",
"Petition": "petition filed in court request legal relief petitioner",
"Legal Notice": "legal notice demand notice lawyer issued notice"
}

labels = list(doc_types.keys())
documents = list(doc_types.values())

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(documents)


def classify_document(text):

    query = vectorizer.transform([text])

    similarity = cosine_similarity(query, tfidf_matrix)[0]

    index = similarity.argmax()

    return labels[index]