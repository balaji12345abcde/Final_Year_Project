from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Document
from .utils import extract_pdf_text


# ==========================
# 📤 Upload Document
# ==========================
class UploadDocumentView(APIView):

    permission_classes = [IsAuthenticated]  # 🔐 user required

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=400)

        text = extract_pdf_text(uploaded_file)

        document = Document.objects.create(
    user=request.user,   # 🔥 MUST ADD
    file=uploaded_file,
    extracted_text=text
)

        return Response({
            "message": "File uploaded successfully",
            "document_id": document.id
        })


# ==========================
# 📊 Dashboard API
# ==========================
class DashboardView(APIView):

    permission_classes = [IsAuthenticated]  # 🔐 user required

    def get(self, request):

        # 🔥 FILTER BY USER
        docs = Document.objects.filter(user=request.user).order_by("-created_at")

        total_docs = docs.count()

        latest_doc = docs.first()

        document_type = latest_doc.doc_type if latest_doc and latest_doc.doc_type else "N/A"
        risk_level = latest_doc.risk_level if latest_doc and latest_doc.risk_level else "Low"

        # 📜 History
        history = [
            {
                "name": d.file.name.split("/")[-1],
                "date": d.created_at.strftime("%d %b")
            }
            for d in docs[:5]
        ]

        # 📊 Chart data (document types count)
        type_counts = {}
        for d in docs:
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
            "chart_data": chart_data  # 🔥 NEW
        })