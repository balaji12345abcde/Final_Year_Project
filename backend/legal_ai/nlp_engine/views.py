from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from documents.models import Document
from .matching_service import hybrid_match
from .summarizer import generate_summary
from .risk_analyzer import detect_risk
from .explainable_ai import explain_match
from .models import AnalysisResult
from .chatbot_engine import chatbot_response
class AnalyzeDocumentView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        document_id=request.data.get("document_id")
        user_query=request.data.get("query","")
        try:
            document=Document.objects.get(id=document_id,user=request.user)
        except Document.DoesNotExist:
            return Response({"error":"Document not found"},status=404)
        result=hybrid_match(document.extracted_text)
        summary=generate_summary(document.extracted_text)
        risk_level=detect_risk(document.extracted_text)
        explanation=explain_match(document.extracted_text,result["description"])
        chat_reply=""
        if user_query:
            chat_reply=chatbot_response(
                document.extracted_text,
                user_query
            )
        analysis=AnalysisResult.objects.create(
            document=document,
            summary=summary,
            act_section=f"{result['act_name']}-{result['section_number']}",
            confidence_score=result["confidence_score"],
            risk_level=risk_level,
            simplified_text=summary,
            translated_text="")
        if not result:
            return Response({"error":"No Acts available"},status=400)
        return Response({
            "act_name":result["act_name"],
            "section_number":result["section_number"],
            "confidence_score":result["confidence_score"],
            "summary":summary,
            "risk_level":risk_level,
            "explanation":explanation,
            "chatbot_response":chat_reply
        })
    