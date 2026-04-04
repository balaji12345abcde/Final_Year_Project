from nlp_engine.model_loader import embedder, text_generator
import faiss
import numpy as np

# 🔥 CACHE (IMPORTANT)
INDEX_CACHE = {}

# =========================
# 🔥 SPLIT TEXT
# =========================
def split_text(text, chunk_size=300):
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]


# =========================
# 🔥 BUILD / GET INDEX
# =========================
def get_or_create_index(doc_id, text):

    if doc_id in INDEX_CACHE:
        return INDEX_CACHE[doc_id]

    chunks = split_text(text)
    embeddings = embedder.encode(chunks)

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    INDEX_CACHE[doc_id] = (index, chunks)

    return index, chunks


# =========================
# 🔥 MAIN FUNCTION
# =========================
def ask_document(doc_id, text, question):

    if not text or not question:
        return "Please provide valid document and question."

    # 🔥 FAST INDEX
    index, chunks = get_or_create_index(doc_id, text)

    question_embedding = embedder.encode([question])

    distances, indices = index.search(
        np.array(question_embedding),
        k=3
    )

    context = " ".join([chunks[i] for i in indices[0]])

    # 🔥 CONTROLLED PROMPT
    prompt = f"""
You are an Indian legal assistant.

RULES:
- Answer ONLY from given document
- If answer not found, say: "Not found in document"
- Explain clearly in simple English
- Do not repeat sentences

Document:
{context}

Question:
{question}

Answer:
"""

    result = text_generator(
        prompt,
        max_length=120,
        min_length=40,
        do_sample=False   # 🔥 IMPORTANT (stable output)
    )

    answer = result[0]["generated_text"].replace(prompt, "").strip()

    return answer