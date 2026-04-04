from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view

from django.http import JsonResponse
from .models import Document
from .utils import extract_pdf_text

import threading


# =====================================================
# 🔥 BACKGROUND PDF PROCESSING
# =====================================================
def process_pdf(document, file):
    try:
        text = extract_pdf_text(file)
        document.extracted_text = text
        document.save()
    except Exception as e:
        print("PDF processing error:", e)


# =====================================================
# 🗑️ DELETE DOCUMENT (SECURE)
# =====================================================
@api_view(["DELETE"])
def delete_document(request, doc_id):
    try:
        doc = Document.objects.get(id=doc_id, user=request.user)
        doc.delete()

        return Response({"message": "Deleted successfully"})

    except Document.DoesNotExist:
        return Response({"error": "Document not found"}, status=404)


# =====================================================
# 📤 UPLOAD DOCUMENT (FAST + SAFE)
# =====================================================
class UploadDocumentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=400)

        # 🔥 FILE TYPE CHECK
        if not uploaded_file.name.lower().endswith(".pdf"):
            return Response({"error": "Only PDF files allowed"}, status=400)

        # 🔥 FILE SIZE LIMIT (10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({"error": "File too large (Max 10MB)"}, status=400)

        # 🔥 CREATE EMPTY DOCUMENT (FAST RESPONSE)
        document = Document.objects.create(
            user=request.user,
            file=uploaded_file,
            extracted_text=""
        )

        # 🔥 BACKGROUND PROCESSING
        threading.Thread(
            target=process_pdf,
            args=(document, uploaded_file),
            daemon=True
        ).start()

        return Response({
            "message": "File uploaded successfully",
            "document_id": document.id
        })


# =====================================================
# 📊 DASHBOARD API (OPTIMIZED)
# =====================================================
class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        docs = Document.objects.filter(user=request.user).only(
            "id", "file", "created_at", "doc_type", "risk_level"
        ).order_by("-created_at")

        # 🔥 EMPTY CASE HANDLING
        if not docs.exists():
            return Response({
                "total_documents": 0,
                "document_type": "N/A",
                "risk_level": "N/A",
                "history": [],
                "chart_data": []
            })

        total_docs = docs.count()
        latest_doc = docs.first()

        document_type = latest_doc.doc_type if latest_doc.doc_type else "N/A"
        risk_level = latest_doc.risk_level if latest_doc.risk_level else "Low"

        # =========================
        # 📜 HISTORY (LATEST 5)
        # =========================
        history = [
            {
                "id": d.id,
                "name": d.file.name.split("/")[-1],
                "date": d.created_at.strftime("%d %b")
            }
            for d in docs[:5]
        ]

        # =========================
        # 📊 CHART DATA (LIMITED)
        # =========================
        type_counts = {}

        for d in docs[:50]:  # 🔥 LIMIT FOR PERFORMANCE
            t = d.doc_type if d.doc_type else "Unknown"
            type_counts[t] = type_counts.get(t, 0) + 1

        chart_data = [
            {"name": k, "value": v}
            for k, v in type_counts.items()
        ]

        return Response({
            "total_documents": total_docs,
            "document_type": document_type,
            "risk_level": risk_level,
            "history": history,
            "chart_data": chart_data
        })