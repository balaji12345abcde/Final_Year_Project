from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Document
from .utils import extract_pdf_text


class UploadDocumentView(APIView):

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=400)

        # Extract text from PDF
        text = extract_pdf_text(uploaded_file)

        document = Document.objects.create(
            file=uploaded_file,
            extracted_text=text
        )

        return Response({
            "message": "File uploaded successfully",
            "document_id": document.id
        })