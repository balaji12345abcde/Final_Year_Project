from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import pipeline

# Load model once
legal_generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

class GeneralChatbot(APIView):

    def post(self, request):

        question = request.data.get("question")

        if not question:
            return Response({"answer": "Please ask a legal question."})

        prompt = f"""
You are an Indian legal assistant.

Answer the question based only on Indian law basis.
If the question mentions IPC sections, explain the correct section meaning and punishment.

Question: {question}

Answer clearly in india act and section and legal based:
"""

        result = legal_generator(
            prompt,
            max_length=200,
            do_sample=False,
            temperature=0.2
        )

        answer = result[0]["generated_text"]

        return Response({
            "answer": answer
        })