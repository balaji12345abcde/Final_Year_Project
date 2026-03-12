from django.urls import path
from .views import DocumentChatbot, GeneralChatbot

urlpatterns = [

    path("document/", DocumentChatbot.as_view()),
    path("general/", GeneralChatbot.as_view()),

]