from nlp_engine.model_loader import text_generator
import re

# =========================
# 🔥 GREETING DETECTION (SMART)
# =========================
def is_greeting(text):

    text = text.lower()

    patterns = [
        r"\bhi\b", r"\bhello\b", r"\bhey\b",
        r"how are you", r"what's up", r"good (morning|evening|afternoon)"
    ]

    return any(re.search(p, text) for p in patterns)


# =========================
# 🔥 GREETING RESPONSE
# =========================
def handle_greeting():
    return "Hello 👋 I'm your AI Legal Assistant. How can I help you today?"


# =========================
# 🔥 THANKS DETECTION
# =========================
def is_thanks(text):
    return "thank" in text.lower()


# =========================
# 🔥 LEGAL RESPONSE (CONTROLLED)
# =========================
def generate_legal_answer(question):

    prompt = f"""
You are an expert Indian legal assistant.

Answer clearly based on Indian law.
Explain simply.
Mention IPC/CrPC sections if relevant.

Question:
{question}

Answer:
"""

    result = text_generator(
        prompt,
        max_length=120,
        min_length=40,
        do_sample=False   # 🔥 IMPORTANT
    )

    return result[0]["generated_text"].replace(prompt, "").strip()


# =========================
# 🔥 MAIN FUNCTION
# =========================
def Generalchatbot(question):

    if not question:
        return "Please ask a legal question."

    if is_greeting(question):
        return handle_greeting()

    if is_thanks(question):
        return "You're welcome 😊 Let me know if you need legal help."

    return generate_legal_answer(question)