from rest_framework.views import APIView
from rest_framework.response import Response

from .chatbot_engine import legal_chat

class LegalChatView(APIView):

    def post(self,request):

        question = request.data.get("question")

        answer = legal_chat(question)

        return Response({

            "answer":answer

        })