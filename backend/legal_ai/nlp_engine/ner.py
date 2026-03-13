import spacy

nlp = spacy.load("en_core_web_sm")

def extract_entities(text):

    doc = nlp(text)

    unique_entities = set()

    for ent in doc.ents:

        if ent.label_ in ["PERSON","ORG","GPE","DATE"]:

            unique_entities.add((ent.text, ent.label_))

    entities = []

    for text,label in unique_entities:

        entities.append({
            "text": text,
            "label": label
        })

    return entities