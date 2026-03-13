import re

# Fraud related keywords
fraud_keywords = [
    "fraud", "cheating", "deceive", "scam",
    "misrepresentation", "forgery", "dishonest"
]

# Threat related keywords
threat_keywords = [
    "threat", "intimidation", "force",
    "coercion", "blackmail"
]

# Money patterns
money_patterns = [
    r"rs\.?\s?\d+",
    r"rupees\s?\d+",
    r"\d+\s?lakhs?",
    r"\d+\s?crores?",
    r"\d+\s?thousand"
]

# High severity IPC sections
high_risk_sections = [
    "420", "406", "468", "471", "120B"
]


def detect_money(text):
    """
    Detect money mentions in text
    """
    for pattern in money_patterns:
        if re.search(pattern, text):
            return True
    return False


def keyword_score(text, keywords, weight):
    """
    Calculate score based on keyword occurrences
    """
    score = 0
    for word in keywords:
        if re.search(rf"\b{word}\b", text):
            score += weight
    return score


def calculate_risk(text, detected_sections=None, entities=None):
    """
    Hybrid risk analysis engine
    """

    if detected_sections is None:
        detected_sections = []

    if entities is None:
        entities = []

    text = text.lower()
    score = 0

    # Fraud signals
    score += keyword_score(text, fraud_keywords, 3)

    # Threat signals
    score += keyword_score(text, threat_keywords, 2)

    # Money detection
    if detect_money(text):
        score += 2

    # Criminal section detection
    for sec in detected_sections:
        if str(sec) in high_risk_sections:
            score += 3

    # NER entity signals
    entity_labels = [e["label"] for e in entities]

    if "PERSON" in entity_labels and detect_money(text):
        score += 2

    if "ORG" in entity_labels and detect_money(text):
        score += 1

    # Final classification
    if score >= 8:
        risk = "High Risk"
    elif score >= 4:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"

    return {
        "risk_level": risk,
        "risk_score": score
    }