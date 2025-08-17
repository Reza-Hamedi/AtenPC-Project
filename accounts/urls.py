# accounts/urls.py
from django.urls import path
from .views import CheckUsernameView, UserProfileView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('check-username/', CheckUsernameView.as_view(), name='check_username'),
    path('profile/me/', UserProfileView.as_view(), name='user_profile'),
]