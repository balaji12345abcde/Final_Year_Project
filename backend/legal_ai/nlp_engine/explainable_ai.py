import nltk

def explain_match(text,description):

    sentences = nltk.sent_tokenize(text)

    for s in sentences:

        if description.split()[0] in s.lower():

            return s

    return sentences[0]