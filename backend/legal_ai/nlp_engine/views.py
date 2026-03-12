from rest_framework.views import APIView
from rest_framework.response import Response

from documents.models import Document

from .summarizer import generate_summary
from .ner import extract_entities
from .risk_analyzer import calculate_risk
from .act_section_detector import detect_acts_sections
from .document_classifier import classify_document


class AnalyzeDocumentView(APIView):

    def post(self, request):

        doc_id = request.data.get("document_id")

        doc = Document.objects.get(id=doc_id)

        text = doc.extracted_text

        summary = generate_summary(text)

        entities = extract_entities(text)

        acts = detect_acts_sections(text)

        risk = calculate_risk(text)

        doc_type = classify_document(text)

        return Response({

            "document_type": doc_type,

            "summary": summary,

            "entities": entities,

            "acts": acts,

            "risk_level": risk

        })