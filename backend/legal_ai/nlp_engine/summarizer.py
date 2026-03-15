import re
import nltk
from transformers import pipeline, AutoTokenizer
from sentence_transformers import SentenceTransformer, util

nltk.download("punkt")

# BART summarizer
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

# tokenizer for safe chunking
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

# BERT semantic model
bert_model = SentenceTransformer("all-MiniLM-L6-v2")


# --------------------------------
# Known legal headings
# --------------------------------

LEGAL_HEADINGS = [
    "FACTS",
    "BACKGROUND",
    "INTRODUCTION",
    "ARGUMENTS",
    "ANALYSIS",
    "JUDGMENT",
    "DECISION",
    "ORDER",
    "PARTIES",
    "PAYMENT TERMS",
    "CONFIDENTIALITY",
    "TERMINATION",
    "SCOPE OF WORK"
]


# --------------------------------
# Detect headings using BERT
# --------------------------------

def detect_headings_with_bert(text):

    lines = text.split("\n")

    sections = {}

    current_heading = "INTRODUCTION"

    sections[current_heading] = ""

    heading_embeddings = bert_model.encode(LEGAL_HEADINGS)

    for line in lines:

        line = line.strip()

        if len(line) < 4:
            continue

        # encode line
        line_embedding = bert_model.encode(line)

        similarity = util.cos_sim(line_embedding, heading_embeddings)

        max_score = similarity.max().item()

        if max_score > 0.65:

            current_heading = line

            sections[current_heading] = ""

        else:

            sections[current_heading] += " " + line

    return sections


# --------------------------------
# Token safe chunking
# --------------------------------

def chunk_text(text, max_tokens=800):

    tokens = tokenizer.encode(text)

    chunks = []

    for i in range(0, len(tokens), max_tokens):

        chunk_tokens = tokens[i:i+max_tokens]

        chunk = tokenizer.decode(chunk_tokens)

        chunks.append(chunk)

    return chunks


# --------------------------------
# Summarize chunk
# --------------------------------

def summarize_chunk(chunk):

    try:

        result = summarizer(
            chunk,
            max_length=100,
            min_length=25,
            do_sample=False
        )

        return result[0]["summary_text"]

    except Exception as e:

        print("Chunk error:", e)

        return ""


# --------------------------------
# Summarize section
# --------------------------------

def summarize_section(text):

    chunks = chunk_text(text)

    summaries = []

    for chunk in chunks:

        if len(chunk.split()) < 40:
            continue

        summary = summarize_chunk(chunk)

        if summary:
            summaries.append(summary)

    return " ".join(summaries)


# --------------------------------
# Main structured summarization
# --------------------------------

def generate_structured_summary(text):

    sections = detect_headings_with_bert(text)

    summaries = {}

    for heading, content in sections.items():

        content = content.strip()

        if len(content.split()) < 80:
            continue

        summaries[heading] = summarize_section(content)

    return summaries