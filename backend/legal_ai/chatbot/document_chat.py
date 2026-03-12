from sentence_transformers import SentenceTransformer
from transformers import pipeline
import faiss
import numpy as np

# embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# text generator
generator = pipeline(
    "text-generation",
    model="google/flan-t5-base"
)


def split_text(text, chunk_size=400):

    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):

        chunk = " ".join(words[i:i+chunk_size])

        chunks.append(chunk)

    return chunks


def build_index(chunks):

    embeddings = embedder.encode(chunks)

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(np.array(embeddings))

    return index, embeddings


def ask_document(text, question):

    chunks = split_text(text)

    index, embeddings = build_index(chunks)

    question_embedding = embedder.encode([question])

    distances, indices = index.search(np.array(question_embedding), k=2)

    context = ""

    for i in indices[0]:
        context += chunks[i] + " "

    prompt = f"""
    Answer based only on the legal document.

    Document:
    {context}

    Question:
    {question}

    Answer:
    """

    result = generator(prompt, max_length=150)

    return result[0]["generated_text"].replace(prompt, "")