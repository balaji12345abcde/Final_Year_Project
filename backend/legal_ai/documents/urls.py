from django.urls import path
from .views import UploadDocumentView, DashboardView

urlpatterns = [
    path("upload/", UploadDocumentView.as_view()),
    path("dashboard/", DashboardView.as_view()),  # 🔥 ADD THIS
]