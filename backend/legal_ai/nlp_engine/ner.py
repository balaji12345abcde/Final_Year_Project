from .model_loader import nlp

# =========================================
# 🔥 FAST BATCH NER (NO THREADS NEEDED)
# =========================================
def extract_entities(text):

    docs = list(nlp.pipe([text], batch_size=50))  # 🔥 very fast

    entities = set()

    for doc in docs:
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "GPE", "DATE"]:
                entities.add((ent.text.strip(), ent.label_))

    return [
        {"text": t, "label": l}
        for t, l in entities
    ]