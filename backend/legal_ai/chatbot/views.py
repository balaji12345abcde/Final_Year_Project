from rest_framework.views import APIView
from rest_framework.response import Response
from .document_chat import ask_document
from documents.models import Document
from rest_framework.views import APIView
from rest_framework.response import Response
from documents.models import Document

class DocumentChatbot(APIView):

    def post(self,request):

        document_id = request.data.get("document_id")
        question = request.data.get("question")

        doc = Document.objects.get(id=document_id)

        context = doc.extracted_text

        result = ask_document(document_id, context, question)

        return Response({
            "answer": result
        })
from rest_framework.views import APIView
from rest_framework.response import Response
from .general_chat import Generalchatbot

class GeneralChatbot(APIView):

    def post(self, request):

        question = request.data.get("question")

        answer=Generalchatbot(question)
        return Response({
            "answer": answer
        })