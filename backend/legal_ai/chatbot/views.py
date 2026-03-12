from rest_framework.views import APIView
from rest_framework.response import Response

from documents.models import Document
from rest_framework.views import APIView
from rest_framework.response import Response
from documents.models import Document
from transformers import pipeline

qa_pipeline = pipeline("question-answering")

class DocumentChatbot(APIView):

    def post(self,request):

        document_id = request.data.get("document_id")
        question = request.data.get("question")

        doc = Document.objects.get(id=document_id)

        context = doc.extracted_text

        result = qa_pipeline(
            question=question,
            context=context
        )

        return Response({
            "answer": result["answer"]
        })
from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import pipeline

# load once when server starts
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
        You are a legal assistent.
        Explain the following legal question clearly in simple terms.

        Question: {question}

        Give a detailed explaination including punishment if applicable.
        """

        result = legal_generator(prompt, max_length=256,do_sample=True,temperature=0.7,top_p=0.9)

        answer = result[0]["generated_text"]

        return Response({
            "answer": answer
        })