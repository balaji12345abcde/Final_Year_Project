def calculate_risk(text):

    high_keywords = [
        "fraud",
        "cheating",
        "scam",
        "money laundering",
        "bribe"
    ]

    score = 0

    for word in high_keywords:
        if word in text.lower():
            score += 1

    if score >= 3:
        return "High Risk"
    elif score >= 1:
        return "Medium Risk"

    return "Low Risk"