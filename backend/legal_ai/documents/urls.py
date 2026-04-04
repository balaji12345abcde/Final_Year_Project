from django.urls import path
from .views import UploadDocumentView, DashboardView, delete_document

urlpatterns = [
    path("upload/", UploadDocumentView.as_view(), name="upload_document"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("delete/<int:doc_id>/", delete_document, name="delete_document"),
]