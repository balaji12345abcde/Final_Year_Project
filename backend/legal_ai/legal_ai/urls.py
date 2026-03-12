from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from documents.views import UploadDocumentView
from nlp_engine.views import AnalyzeDocumentView


urlpatterns = [

path("api/documents/upload/", UploadDocumentView.as_view()),

path("api/nlp/analyze/", AnalyzeDocumentView.as_view()),

path("api/chat/", include("chatbot.urls"))

]

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)