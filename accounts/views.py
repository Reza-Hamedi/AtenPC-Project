# accounts/views.py
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer 
import random
import re

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserCreateSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    نمایش و ویرایش پروفایل کاربری که وارد شده است.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CheckUsernameView(APIView):
    def get(self, request, *args, **kwargs):
        first_name = request.query_params.get('first_name', '')
        last_name = request.query_params.get('last_name', '')

        if not first_name or not last_name:
            return Response({'suggestions': []})

        def to_fenglish(text):
            mapping = {
                'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j',
                'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
                'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
                'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l',
                'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'y', ' ': ''
            }
            fenglish_text = "".join(mapping.get(char, char) for char in text)
            cleaned_text = re.sub(r'[^a-zA-Z0-9_]', '', fenglish_text)
            return cleaned_text

        en_first_name = to_fenglish(first_name.lower())
        en_last_name = to_fenglish(last_name.lower())

        base_suggestions = [
            f'{en_first_name}{en_last_name}',
            f'{en_first_name}_{en_last_name}',
            f'{en_first_name}{random.randint(10, 99)}',
        ]

        available_suggestions = []
        for suggestion in base_suggestions:
            if not CustomUser.objects.filter(username__iexact=suggestion).exists():
                available_suggestions.append(suggestion)
        
        return Response({'suggestions': available_suggestions})