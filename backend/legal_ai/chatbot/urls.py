from django.urls import path
from .views import DocumentChatbot, GeneralChatbot

urlpatterns = [
    path("document-chat/", DocumentChatbot.as_view(), name="document_chat"),
    path("general-chat/", GeneralChatbot.as_view(), name="general_chat"),
]