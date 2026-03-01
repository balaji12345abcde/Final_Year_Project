from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import nltk

nltk.download('punkt')
nltk.download('punkt_tab')
model=SentenceTransformer('all-MiniLM-L6-v2')

def explain_match(document_text,act_description):
    sentences=nltk.sent_tokenize(document_text)
    sentence_embeddings=model.encode(sentences)
    act_embedding=model.encode([act_description])
    similarities=cosine_similarity(sentence_embeddings,act_embedding)
    best_index=similarities.argmax()
    return sentences[best_index]