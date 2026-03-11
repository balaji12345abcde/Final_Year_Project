from rest_framework.views import APIView
from rest_framework.response import Response

from documents.models import Document

from .summarizer import generate_summary
from .ner_extractor import extract_entities
from .risk_analyzer import detect_risk
from .classifier import classify_document
from .matching_service import hybrid_match
from .document_chatbot import document_chatbot


class AnalyzeDocumentView(APIView):

    def post(self, request):

        document_id = request.data.get("document_id")
        query = request.data.get("query", "")

        try:
            doc = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"})

        # IMPORTANT: USE TEXT NOT FILE
        text = doc.extracted_text

        if not text:
            return Response({
                "error": "Document text not extracted"
            })

        document_type = classify_document(text)

        entities = extract_entities(text)

        summary = generate_summary(text)

        risk = detect_risk(text)

        act_result = hybrid_match(text)

        chatbot_answer = ""

        if query:
            chatbot_answer = document_chatbot(text, query)

        return Response({
            "document_type": document_type,
            "summary": summary,
            "risk_level": risk,
            "entities": entities,
            "act_name": act_result["act_name"],
            "section_number": act_result["section_number"],
            "confidence_score": act_result["confidence_score"],
            "chatbot_response": chatbot_answer
        })