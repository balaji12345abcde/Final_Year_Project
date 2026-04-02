from django.urls import path
from .views import AnalyzeDocumentView,stream_summary
urlpatterns = [

    path("analyze/",AnalyzeDocumentView.as_view(),name="analyze_document"),
    path("stream-summary/<int:doc_id>/", stream_summary),

]