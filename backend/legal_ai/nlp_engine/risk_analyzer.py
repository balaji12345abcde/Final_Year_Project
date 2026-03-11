import spacy

nlp = spacy.load("en_core_web_sm")

high_risk_words = [
"fraud","cheating","forgery","murder","crime","scam"
]

medium_risk_words = [
"penalty","breach","violation","dispute"
]


def detect_risk(text):

    doc = nlp(text.lower())

    score = 0

    for token in doc:

        if token.text in high_risk_words:
            score += 3

        if token.text in medium_risk_words:
            score += 1

    if score >= 6:
        return "High Risk"

    if score >= 3:
        return "Medium Risk"

    return "Low Risk"