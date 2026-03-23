from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path("admin/",admin.site.urls),
    # ✅ DOCUMENTS APP (upload + dashboard)
    path("api/documents/", include("documents.urls")),

    # ✅ NLP ENGINE
    path("api/nlp/", include("nlp_engine.urls")),

    # ✅ CHATBOT
    path("api/chat/", include("chatbot.urls")),

    path("api/users/", include("users.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)