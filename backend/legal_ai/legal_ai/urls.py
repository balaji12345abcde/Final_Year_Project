from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path("admin/", admin.site.urls),

    # 🔥 API VERSIONING (IMPORTANT)
    path("api/v1/documents/", include("documents.urls")),
    path("api/v1/nlp/", include("nlp_engine.urls")),
    path("api/v1/chat/", include("chatbot.urls")),
    path("api/v1/users/", include("users.urls")),
]

# 🔥 MEDIA FILES
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)