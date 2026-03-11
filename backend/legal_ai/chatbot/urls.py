from django.urls import path
from .views import LegalChatView

urlpatterns = [

    path("ask/",LegalChatView.as_view())

]