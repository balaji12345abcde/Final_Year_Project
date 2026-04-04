import re

# =========================================
# 🔥 KEYWORD GROUPS (EXPANDED)
# =========================================
fraud_keywords = [
    "fraud", "cheating", "deceive", "scam",
    "misrepresentation", "forgery", "dishonest",
    "fake", "illegal", "unauthorized"
]

threat_keywords = [
    "threat", "intimidation", "force",
    "coercion", "blackmail", "harassment"
]

legal_keywords = [
    "breach", "violation", "illegal", "offence",
    "penalty", "punishable", "criminal"
]

# =========================================
# 🔥 MONEY PATTERNS (STRONG SIGNAL)
# =========================================
money_patterns = [
    re.compile(r"rs\.?\s?\d+"),
    re.compile(r"rupees\s?\d+"),
    re.compile(r"\d+\s?lakhs?"),
    re.compile(r"\d+\s?crores?"),
    re.compile(r"\d{1,3}(,\d{3})+")
]

# =========================================
# 🔥 HIGH RISK IPC SECTIONS
# =========================================
high_risk_sections = ["420", "406", "468", "471", "120B"]


# =========================================
# 🔥 DETECT MONEY
# =========================================
def detect_money(text):
    return any(re.search(p, text) for p in money_patterns)


# =========================================
# 🔥 COUNT KEYWORDS
# =========================================
def keyword_score(text, keywords, weight):

    count = sum(len(re.findall(rf"\b{k}\b", text)) for k in keywords)

    return count * weight, count


# =========================================
# 🔥 MAIN RISK ENGINE
# =========================================
def calculate_risk(text, detected_sections=None, entities=None):

    text = text.lower()

    score = 0
    reasons = []

    # =========================================
    # 🔥 FRAUD SCORE
    # =========================================
    fraud_score, fraud_count = keyword_score(text, fraud_keywords, 3)
    if fraud_count:
        score += fraud_score
        reasons.append(f"Fraud-related terms detected ({fraud_count} times)")

    # =========================================
    # 🔥 THREAT SCORE
    # =========================================
    threat_score, threat_count = keyword_score(text, threat_keywords, 2)
    if threat_count:
        score += threat_score
        reasons.append(f"Threat-related terms detected ({threat_count} times)")

    # =========================================
    # 🔥 LEGAL VIOLATION SCORE
    # =========================================
    legal_score, legal_count = keyword_score(text, legal_keywords, 2)
    if legal_count:
        score += legal_score
        reasons.append(f"Legal violation terms detected ({legal_count} times)")

    # =========================================
    # 🔥 MONEY SIGNAL
    # =========================================
    if detect_money(text):
        score += 3
        reasons.append("Money transaction detected")

    # =========================================
    # 🔥 HIGH RISK IPC SECTIONS
    # =========================================
    if detected_sections:
        for sec in detected_sections:
            if str(sec) in high_risk_sections:
                score += 4
                reasons.append(f"High-risk IPC Section detected ({sec})")

    # =========================================
    # 🔥 ENTITY ANALYSIS
    # =========================================
    if entities:

        labels = [e["label"] for e in entities]

        if "PERSON" in labels and detect_money(text):
            score += 2
            reasons.append("Money transaction involving individuals")

        if "ORG" in labels and detect_money(text):
            score += 2
            reasons.append("Money transaction involving organizations")

    # =========================================
    # 🔥 FREQUENCY BOOST
    # =========================================
    total_words = len(text.split())

    if total_words > 5000:
        score *= 1.1   # slight boost for large docs

    # =========================================
    # 🔥 FINAL CLASSIFICATION
    # =========================================
    if score >= 12:
        risk = "High Risk"
    elif score >= 6:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"

    return {
        "risk_level": risk,
        "risk_score": round(score, 2),
        "risk_factors": reasons   # 🔥 NEW FEATURE
    }