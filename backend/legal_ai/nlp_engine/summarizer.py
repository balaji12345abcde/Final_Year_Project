"""import nltk
from transformers import pipeline, AutoTokenizer
from sentence_transformers import SentenceTransformer, util
from concurrent.futures import ThreadPoolExecutor

nltk.download("punkt")

# Load once
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")
bert_model = SentenceTransformer("all-MiniLM-L6-v2")

LEGAL_HEADINGS = [
    "FACTS", "BACKGROUND", "INTRODUCTION", "ARGUMENTS",
    "ANALYSIS", "JUDGMENT", "DECISION", "ORDER",
    "PARTIES", "PAYMENT TERMS", "CONFIDENTIALITY",
    "TERMINATION", "SCOPE OF WORK"
]


# -------------------------------
# Faster Heading Detection
# -------------------------------
def detect_headings_with_bert(text):

    lines = text.split("\n")
    sections = {}
    current_heading = "INTRODUCTION"
    sections[current_heading] = ""

    heading_embeddings = bert_model.encode(LEGAL_HEADINGS)

    for line in lines:
        line = line.strip()
        if len(line) < 5:
            continue

        line_embedding = bert_model.encode(line)
        similarity = util.cos_sim(line_embedding, heading_embeddings)

        if similarity.max().item() > 0.7:
            current_heading = line
            sections[current_heading] = ""
        else:
            sections[current_heading] += " " + line

    return sections


# -------------------------------
# Smart Chunking
# -------------------------------
def chunk_text(text, max_tokens=700):

    tokens = tokenizer.encode(text)

    if len(tokens) < 800:
        return [text]   # small text no chunk

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk = tokenizer.decode(tokens[i:i+max_tokens])
        chunks.append(chunk)

    return chunks


# -------------------------------
# Fast Chunk Summarization
# -------------------------------
def summarize_chunk(chunk):

    try:
        result = summarizer(
            chunk,
            max_length=120,
            min_length=40,
            do_sample=False
        )
        return result[0]["summary_text"]

    except Exception:
        return ""


# -------------------------------
# Parallel Section Summary
# -------------------------------
def summarize_section(text):

    chunks = chunk_text(text)

    with ThreadPoolExecutor() as executor:
        summaries = list(executor.map(summarize_chunk, chunks))

    summaries = [s for s in summaries if s]

    return " ".join(summaries)


# -------------------------------
# FINAL STRUCTURED SUMMARY
# -------------------------------
def generate_structured_summary(text):

    # small doc fast path
    if len(text.split()) < 120:
        return {
            "SUMMARY": summarize_chunk(text)
        }

    sections = detect_headings_with_bert(text)

    summaries = {}

    def process_section(item):
        heading, content = item
        content = content.strip()

        if len(content.split()) < 50:
            return None

        return (heading, summarize_section(content))

    with ThreadPoolExecutor() as executor:
        results = list(executor.map(process_section, sections.items()))

    for r in results:
        if r:
            summaries[r[0]] = r[1]

    return summaries
"""
import nltk
from transformers import pipeline, AutoTokenizer

nltk.download("punkt")

# =========================================
# 🔥 MODEL (BEST BALANCE)
# =========================================
summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=-1
)

tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")


# =========================================
# 🔥 BIGGER CHUNKS (LESS SPLIT)
# =========================================
"""def chunk_text(text, max_tokens=900):

    tokens = tokenizer.encode(text)

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk = tokenizer.decode(tokens[i:i + max_tokens])
        chunks.append(chunk)

    return chunks
"""
def chunk_text(text, max_tokens=500):

    tokens = tokenizer.encode(text, truncation=False)

    chunks = []

    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk)

    return chunks

# =========================================
# 🔥 MUCH LONGER SUMMARY
# =========================================
def summarize_chunk(chunk):

    try:
        result = summarizer(
            chunk,
            max_length=250,   # 🔥 MUCH LONGER
            min_length=120,   # 🔥 FORCE LONG OUTPUT
            do_sample=False
        )

        return result[0]["summary_text"]

    except Exception:
        return ""


# =========================================
# 🔥 FINAL SUMMARY (NO COMPRESSION)
# =========================================
def generate_summary(text):

    chunks = chunk_text(text)

    summaries = []

    for chunk in chunks:

        # skip very small chunks
        if len(chunk.split()) < 50:
            continue

        summary = summarize_chunk(chunk)

        if summary:
            summaries.append(summary)

    # 🔥 DO NOT MERGE INTO ONE LINE
    return {
        "SUMMARY": "\n\n".join(summaries)   # ✅ multi-paragraph
    }