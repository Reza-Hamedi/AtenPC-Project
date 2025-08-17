# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی', {
            'fields': (
                'national_id', 
                'birth_date', 
                'phone_number', 
                'gender', 
                'landline_phone', 
                'interests',
            )
        }),
    )
admin.site.register(CustomUser, CustomUserAdmin)