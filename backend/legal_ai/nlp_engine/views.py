from rest_framework.views import APIView
from rest_framework.response import Response
from documents.models import Document

from concurrent.futures import ThreadPoolExecutor
from django.http import StreamingHttpResponse

import time

from .summarizer import generate_summary
from .ner import extract_entities
from .risk_analyzer import calculate_risk
from .act_section_detector import detect_acts_sections
from .document_classifier import classify_document

from .streaming_summarizer import chunk_text, summarize_chunk


# =====================================================
# 🔥 STREAMING SUMMARY (FIXED & STABLE)
# =====================================================
def stream_summary(request, doc_id):

    try:
        doc = Document.objects.get(id=doc_id)
        text = doc.extracted_text

        chunks = chunk_text(text)

        def generate():

            for chunk in chunks:

                try:
                    summary = summarize_chunk(chunk)

                    if summary:
                        yield f"data: {summary}\n\n"

                        # 🔥 prevents connection drop
                        time.sleep(0.3)

                except Exception as e:
                    yield f"data: Error: {str(e)}\n\n"

            # ✅ END SIGNAL
            yield "data: [DONE]\n\n"

        response = StreamingHttpResponse(
            generate(),
            content_type="text/event-stream"
        )

        # 🔥 IMPORTANT HEADERS
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"

        return response

    except Document.DoesNotExist:
        return StreamingHttpResponse(
            "data: Error: Document not found\n\n",
            content_type="text/event-stream"
        )

    except Exception as e:
        return StreamingHttpResponse(
            f"data: Error: {str(e)}\n\n",
            content_type="text/event-stream"
        )


# =====================================================
# 🔥 FULL DOCUMENT ANALYSIS (PARALLEL)
# =====================================================
class AnalyzeDocumentView(APIView):

    def post(self, request):

        try:
            doc_id = request.data.get("document_id")

            if not doc_id:
                return Response({"error": "document_id required"}, status=400)

            doc = Document.objects.get(id=doc_id)
            text = doc.extracted_text

            with ThreadPoolExecutor(max_workers=2) as executor:

                future_summary = executor.submit(generate_summary, text)
                future_entities = executor.submit(extract_entities, text)
                future_acts = executor.submit(detect_acts_sections, text)
                future_doc_type = executor.submit(classify_document, text)

                summary = future_summary.result()
                entities = future_entities.result()
                acts = future_acts.result()
                document_type = future_doc_type.result()

            sections = [a["section"] for a in acts]

            risk = calculate_risk(text, sections, entities)

            # SAVE
            doc.doc_type = document_type
            doc.risk_level = risk["risk_level"]
            doc.save()

            return Response({
                "document_type": document_type,
                "summary": summary,
                "entities": entities,
                "acts": acts,
                "risk_level": risk["risk_level"],
                "risk_score": risk["risk_score"]
            })

        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)