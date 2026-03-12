import spacy

nlp = spacy.load("en_core_web_sm")

def extract_entities(text):

    doc = nlp(text)

    entities = []

    for ent in doc.ents:

        if ent.label_ in ["PERSON","ORG","GPE","DATE"]:

            label = ent.label_

            if label == "GPE":
                label = "LOCATION"

            entities.append({
                "text": ent.text,
                "label": label
            })

    return entities