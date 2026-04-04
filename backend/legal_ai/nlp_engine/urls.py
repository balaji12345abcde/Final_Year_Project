from django.urls import path
from .views import AnalyzeDocumentView, stream_summary, TranslateSummary,GetDocumentAnalysis

urlpatterns = [
    path("analyze/", AnalyzeDocumentView.as_view(), name="analyze_document"),
    path("stream-summary/<int:doc_id>/", stream_summary, name="stream_summary"),
    path("translate/", TranslateSummary.as_view(), name="translate_summary"),
    path("analysis/<int:doc_id>/", GetDocumentAnalysis.as_view()),
]