from transformers import pipeline

qa = pipeline("question-answering")

def document_chatbot(context,question):

    result = qa({

        "context":context,
        "question":question

    })

    return result["answer"]