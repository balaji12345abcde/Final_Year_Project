from rest_framework import generics
from .serializers import RegisterSerializer
from .models import User

# JWT
from rest_framework_simplejwt.views import TokenObtainPairView


# ✅ Register
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# ✅ Login (JWT)
class LoginView(TokenObtainPairView):
    pass