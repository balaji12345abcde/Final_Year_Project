from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer
from .utils import extract_tect_from_pdf

class DocumentUploadView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        file=request.FILES.get('file')
        if not file:
            return Response({"error":"No file uploaded"},status=400)
        document = Document.objects.create(user=request.user,file=file)
        extracted_text=extract_tect_from_pdf(document.file.path)
        document.extracted_text=extracted_text
        document.save()
        return Response({"message":"File uploaded successfully","document_id":document.id,"extracted_text":extracted_text[:1000]})