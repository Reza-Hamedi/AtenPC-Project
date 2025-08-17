# accounts/serializers.py
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django_recaptcha.fields import ReCaptchaField
from rest_framework import serializers
from .models import CustomUser

class UserCreateSerializer(BaseUserCreateSerializer):
    recaptcha = ReCaptchaField()
    class Meta(BaseUserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name', 'phone_number', 
            'national_id', 'gender')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 
            'national_id', 'birth_date', 'phone_number', 'gender', 
            'landline_phone', 'interests'
        )