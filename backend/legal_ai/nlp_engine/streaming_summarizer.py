"""from transformers import pipeline, AutoTokenizer
import torch

# GPU setup
device = 0 if torch.cuda.is_available() else -1

summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=device  # CPU safe
)

tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")


def chunk_text(text, max_tokens=700):

    tokens = tokenizer.encode(text)

    if len(tokens) < 800:
        return [text]

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk = tokenizer.decode(tokens[i:i+max_tokens])
        chunks.append(chunk)

    return chunks


def summarize_chunk(chunk):

    try:
        result = summarizer(
            chunk,
            max_length=200,
            min_length=100,
            do_sample=False
        )
        return result[0]["summary_text"]

    except Exception:
        return ""
"""
from transformers import pipeline, AutoTokenizer
import torch

# =========================
# 🔥 GPU SUPPORT
# =========================
device = 0 if torch.cuda.is_available() else -1

summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=device
)

tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")


# =========================
# 🔥 SAFE CHUNKING (CRITICAL FIX)
# =========================
def chunk_text(text, max_tokens=500):   # 🔥 REDUCED SIZE

    tokens = tokenizer.encode(text, truncation=False)

    chunks = []

    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]

        # 🔥 SAFE DECODE
        chunk = tokenizer.decode(chunk_tokens, skip_special_tokens=True)

        chunks.append(chunk)

    return chunks


# =========================
# 🔥 SAFE SUMMARIZATION
# =========================
def summarize_chunk(chunk):

    try:
        # 🔥 FORCE TRUNCATION (IMPORTANT)
        inputs = tokenizer(
            chunk,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        result = summarizer(
            tokenizer.decode(inputs["input_ids"][0]),
            max_length=200,   # 🔥 BIGGER OUTPUT
            min_length=80,    # 🔥 MORE CONTENT
            do_sample=False
        )

        return result[0]["summary_text"]

    except Exception as e:
        print("Chunk error:", e)
        return ""