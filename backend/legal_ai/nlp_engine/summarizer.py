from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)


def chunk_text(text, chunk_size=500):

    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)

    return chunks


def generate_summary(text):

    try:

        if not text:
            return "No text found"

        # Limit extremely large documents
        text = text[:20000]

        chunks = chunk_text(text)

        summaries = []

        for chunk in chunks:

            if len(chunk.split()) < 30:
                continue

            result = summarizer(
                chunk,
                max_length=100,
                min_length=30,
                do_sample=False
            )

            summaries.append(result[0]["summary_text"])

        final_summary = " ".join(summaries)

        return final_summary

    except Exception as e:

        return f"Summary error: {str(e)}"