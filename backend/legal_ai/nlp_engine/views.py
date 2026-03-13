from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from documents.models import Document

from .summarizer import generate_summary
from .ner import extract_entities
from .risk_analyzer import calculate_risk
from .act_section_detector import detect_acts_sections
from .document_classifier import classify_document


class AnalyzeDocumentView(APIView):

    def post(self, request):
        doc_id = request.data.get("document_id")

        if not doc_id:
            return Response(
                {"error": "document_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            doc = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        text = doc.extracted_text

        if not text:
            return Response(
                {"error": "Document text not extracted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            doc_type = classify_document(text)

            summary = generate_summary(text)

            entities = extract_entities(text)
            acts = detect_acts_sections(text)

            # Extract section numbers
            detected_sections = [
                a.get("section") for a in acts
            ]
            risk_data = calculate_risk(
                text=text,
                detected_sections=detected_sections,
                entities=entities
            )
            return Response({

                "document_type": doc_type,

                "summary": summary,

                "entities": entities,

                "acts": acts,

                "risk_level": risk_data.get("risk_level"),

                "risk_score": risk_data.get("risk_score")

            })

        except Exception as e:

            return Response(
                {
                    "error": "Analysis failed",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )