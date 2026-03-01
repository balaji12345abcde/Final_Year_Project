from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
nltk.download('punkt')
model=SentenceTransformer('all-MiniLM-L6-v2')
def chatbot_response(document_text,user_query):
    sentences=nltk.sent_tokenize(document_text)
    sentence_embeddings=model.encode(sentences)
    query_embedding=model.encode([user_query])
    similarities=cosine_similarity(query_embedding,sentence_embeddings)
    best_index=similarities.argmax()
    return sentences[best_index]