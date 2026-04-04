from concurrent.futures import ThreadPoolExecutor
from .model_loader import tokenizer, model, device
import torch

# =========================
# 🔥 FAST CHUNKING (WORD BASED)
# =========================
def chunk_text(text, chunk_size=400):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i + chunk_size]))

    return chunks


# =========================
# 🔥 BART SUMMARIZATION
# =========================
def summarize_chunk(chunk):

    try:
        inputs = tokenizer(
            chunk,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        # ✅ FIX: move tensors properly
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            summary_ids = model.generate(
                inputs["input_ids"],
                max_length=120,
                min_length=40,
                num_beams=2,          # ⚡ faster
                early_stopping=True
            )

        return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    except Exception as e:
        print("Chunk error:", e)
        return ""


# =========================
# 🚀 FINAL SUMMARY ENGINE
# =========================
def generate_summary(text):

    chunks = chunk_text(text)

    # 🔥 GPU SAFE → no threading
    if device.type == "cuda":
        summaries = [summarize_chunk(c) for c in chunks]

    else:
        # 🔥 CPU → parallel
        with ThreadPoolExecutor(max_workers=3) as executor:
            summaries = list(executor.map(summarize_chunk, chunks))

    summaries = [s for s in summaries if s]

    # =========================
    # 🔥 FINAL REFINEMENT
    # =========================
    if len(summaries) > 1:
        combined = " ".join(summaries)
        final_summary = summarize_chunk(combined)
    else:
        final_summary = summaries[0] if summaries else ""

    return {
        "SUMMARY": final_summary
    }