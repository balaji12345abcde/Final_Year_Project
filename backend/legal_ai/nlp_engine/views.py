from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from documents.models import Document

from .summarizer import generate_summary
from .ner import extract_entities
from .risk_analyzer import calculate_risk
from .act_section_detector import detect_acts_sections
from .document_classifier import classify_document
from .streaming_summarizer import summarize_chunk, chunk_text
from .translator import translate_text

from concurrent.futures import ThreadPoolExecutor, as_completed


# =====================================================
# 🔥 STREAM SUMMARY (UI ONLY)
# =====================================================
def stream_summary(request, doc_id):

    try:
        doc = Document.objects.get(id=doc_id)
        text = doc.extracted_text

        chunks = list(chunk_text(text))

        def generate():

            collected = []

            with ThreadPoolExecutor(max_workers=3) as executor:
                futures = [executor.submit(summarize_chunk, c) for c in chunks]

                for future in as_completed(futures):
                    summary = future.result()

                    if summary:
                        collected.append(summary)
                        yield f"data: {summary}\n\n"

            # 🔥 SAVE FINAL SUMMARY
            final_summary = " ".join(collected)
            doc.summary_en = final_summary
            doc.save()

            yield "data: [DONE]\n\n"

        return StreamingHttpResponse(generate(), content_type="text/event-stream")

    except Exception as e:
        return StreamingHttpResponse(
            f"data: Error: {str(e)}\n\n",
            content_type="text/event-stream"
        )


# =====================================================
# 🔥 FULL ANALYSIS (PERSISTENT)
# =====================================================
class AnalyzeDocumentView(APIView):

    def post(self, request):

        try:
            doc_id = request.data.get("document_id")

            if not doc_id:
                return Response({"error": "document_id required"}, status=400)

            # 🔐 SECURE QUERY
            doc = Document.objects.get(id=doc_id, user=request.user)
            text = doc.extracted_text

            with ThreadPoolExecutor(max_workers=4) as executor:

                futures = {
                    "summary": executor.submit(generate_summary, text),
                    "entities": executor.submit(extract_entities, text),
                    "acts": executor.submit(detect_acts_sections, text),
                    "doc_type": executor.submit(classify_document, text),
                }

                results = {k: f.result() for k, f in futures.items()}

            # 🔥 RISK
            sections = [a["section"] for a in results["acts"]]

            risk = calculate_risk(
                text,
                sections,
                results["entities"]
            )

            # =====================================================
            # 🔥 SAVE EVERYTHING (IMPORTANT)
            # =====================================================
            doc.summary_en = results["summary"]["SUMMARY"]
            doc.entities = results["entities"]
            doc.acts = results["acts"]
            doc.doc_type = results["doc_type"]
            doc.risk_level = risk["risk_level"]
            doc.risk_score = risk["risk_score"]

            doc.save()

            return Response({
                "document_type": results["doc_type"],
                "summary": results["summary"],
                "entities": results["entities"],
                "acts": results["acts"],
                "risk_level": risk["risk_level"],
                "risk_score": risk["risk_score"],
                "risk_factors": risk.get("risk_factors", [])
            })

        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# =====================================================
# 🔥 FETCH SAVED ANALYSIS (VERY IMPORTANT)
# =====================================================
class GetDocumentAnalysis(APIView):

    def get(self, request, doc_id):

        try:
            doc = Document.objects.get(id=doc_id, user=request.user)

            return Response({
                "summary": doc.summary_en,
                "entities": doc.entities,
                "acts": doc.acts,
                "risk_level": doc.risk_level,
                "risk_score": doc.risk_score,
                "document_type": doc.doc_type
            })

        except Document.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# =====================================================
# 🌍 TRANSLATION (WITH DB CACHE)
# =====================================================
class TranslateSummary(APIView):

    def post(self, request):

        try:
            doc_id = request.data.get("document_id")
            text = request.data.get("text")
            lang = request.data.get("lang")

            if not text or not lang:
                return Response({"error": "Missing data"}, status=400)

            doc = None

            if doc_id:
                doc = Document.objects.get(id=doc_id, user=request.user)

                field_name = f"summary_{lang}"

                if hasattr(doc, field_name):
                    cached = getattr(doc, field_name)
                    if cached:
                        return Response({"translated_text": cached})

            # 🔥 TRANSLATE
            translated = translate_text(text, lang)

            # 🔥 SAVE CACHE
            if doc:
                field_name = f"summary_{lang}"
                if hasattr(doc, field_name):
                    setattr(doc, field_name, translated)
                    doc.save()

            return Response({"translated_text": translated})

        except Exception as e:
            return Response({"error": str(e)}, status=500)