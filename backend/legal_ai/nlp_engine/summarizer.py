from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6"
)

def generate_summary(text):
    text = text[:3000]

    summary = summarizer(
        text,
        max_length=200,
        min_length=50,
        do_sample=False
    )

    return summary[0]['summary_text']