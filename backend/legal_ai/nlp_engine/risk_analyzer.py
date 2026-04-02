import re

fraud_keywords = ["fraud","cheating","deceive","scam","misrepresentation","forgery","dishonest"]
threat_keywords = ["threat","intimidation","force","coercion","blackmail"]

money_patterns = [
    r"rs\.?\s?\d+",
    r"rupees\s?\d+",
    r"\d+\s?lakhs?",
    r"\d+\s?crores?"
]

high_risk_sections = ["420","406","468","471","120B"]


def detect_money(text):
    return any(re.search(p, text) for p in money_patterns)


def keyword_score(text, keywords, weight):
    return sum(weight for word in keywords if word in text)


def calculate_risk(text, detected_sections=None, entities=None):

    text = text.lower()
    score = 0

    score += keyword_score(text, fraud_keywords, 3)
    score += keyword_score(text, threat_keywords, 2)

    if detect_money(text):
        score += 2

    for sec in detected_sections or []:
        if str(sec) in high_risk_sections:
            score += 3

    if entities:
        labels = [e["label"] for e in entities]
        if "PERSON" in labels and detect_money(text):
            score += 2

    if score >= 8:
        risk = "High Risk"
    elif score >= 4:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"

    return {"risk_level": risk, "risk_score": score}