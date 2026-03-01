from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['id','username','email','password']
        def create(self,validate_data):
            user=User.objects.create_user(
                username=validate_data['username'],
                email=validate_data['email'],
                password=validate_data['password']
            )
            return user