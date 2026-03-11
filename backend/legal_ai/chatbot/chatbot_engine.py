from transformers import pipeline

generator = pipeline("text-generation",model="google/flan-t5-base")

def legal_chat(question):

    prompt = f"Answer the following legal question clearly: {question}"

    result = generator(prompt,max_length=200)

    return result[0]["generated_text"]