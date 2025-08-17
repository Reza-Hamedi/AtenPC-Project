# accounts/models.py
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name="customuser_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name="customuser_set",
        related_query_name="user",
    )
    
    first_name = models.CharField("نام", max_length=150)
    last_name = models.CharField("نام خانوادگی", max_length=150)
    email = models.EmailField("ایمیل", unique=True)
    national_id = models.CharField("کد ملی", max_length=10, unique=True, null=True, blank=True)
    birth_date = models.DateField("تاریخ تولد", null=True, blank=True)
    phone_number = models.CharField("شماره همراه", max_length=11, unique=True)
    GENDER_CHOICES = [
        ('MALE', 'مرد'),
        ('FEMALE', 'زن'),
    ]
    gender = models.CharField("جنسیت", max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    landline_phone = models.CharField("تلفن ثابت", max_length=20, blank=True)
    interests = models.TextField("علاقه‌مندی‌ها", blank=True)    
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.username