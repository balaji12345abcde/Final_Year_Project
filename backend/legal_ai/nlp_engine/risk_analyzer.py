import re

HIGH_RISK_KEYWORDS=[
    "fraud","cheating","criminal","breach","rape","threat","intimidation"
]

MEDIUM_RISK_KEYWORDS=[
    "dispute","delay","complaint","violation","neglience"
]

def detect_risk(text):
    text_lower=text.lower();
    high_score=sum(1 for word in HIGH_RISK_KEYWORDS if word in text_lower)
    medium_score=sum(1 for word in MEDIUM_RISK_KEYWORDS if word in text_lower)

    if high_score>0:
        return "High Risk"
    elif medium_score>0:
        return "Medium Risk"
    else:
        return "Low Risk"