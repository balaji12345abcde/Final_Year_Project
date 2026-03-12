from transformers import pipeline

legal_generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)


def legal_chat(question):

    prompt = f"Answer this legal question clearly: {question}"

    result = legal_generator(prompt, max_length=120)

    return result[0]["generated_text"]