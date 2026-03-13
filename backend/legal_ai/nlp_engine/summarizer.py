from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)


def chunk_text(text, chunk_size=600):

    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


def generate_summary(text):

    try:

        if not text:
            return "No text found"

        # Remove extra spaces
        text = " ".join(text.split())

        # limit extremely large documents
        text = text[:15000]

        chunks = chunk_text(text)

        summaries = []

        for chunk in chunks[:5]:   # limit chunks to prevent overload

            if len(chunk.split()) < 40:
                continue

            # truncate chunk safely
            chunk = chunk[:3000]

            result = summarizer(
                chunk,
                max_length=130,
                min_length=40,
                do_sample=False
            )

            summaries.append(result[0]["summary_text"])

        if not summaries:
            return "Unable to generate summary"

        final_summary = " ".join(summaries)

        return final_summary

    except Exception as e:

        print("Summarization Error:", e)

        return "Summary temporarily unavailable for this document."