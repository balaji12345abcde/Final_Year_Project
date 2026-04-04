from concurrent.futures import ThreadPoolExecutor, as_completed
from .model_loader import tokenizer, model, device
import torch

# =========================
# 🔥 FAST CHUNKING (WORD BASED)
# =========================
def chunk_text(text, chunk_size=400):
    words = text.split()

    for i in range(0, len(words), chunk_size):
        yield " ".join(words[i:i + chunk_size])


# =========================
# 🔥 STREAM GENERATOR
# =========================
def summarize_stream(text):

    chunks = list(chunk_text(text))

    # 🔥 GPU SAFE (no threading)
    if device.type == "cuda":

        for chunk in chunks:
            result = summarize_chunk(chunk)
            if result:
                yield result

    else:
        # 🔥 CPU parallel
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(summarize_chunk, c) for c in chunks]

            for future in as_completed(futures):
                result = future.result()
                if result:
                    yield result


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

        # ✅ FIX: move tensors correctly
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            summary_ids = model.generate(
                inputs["input_ids"],
                max_length=100,
                min_length=30,
                num_beams=2,  # ⚡ balance speed + quality
                early_stopping=True
            )

        return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    except Exception as e:
        print("Chunk error:", e)
        return ""