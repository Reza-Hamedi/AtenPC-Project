# atenpc_project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import routers

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # تمام مسیرهای API مربوط به فروشگاه (store)
    path('api/', include('store.urls', namespace='store')),
    
    # تمام مسیرهای API مربوط به حساب‌های کاربری (accounts)
    path('api/', include('accounts.urls')), 
    
    # مسیرهای پیش‌فرض Djoser برای احراز هویت
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # --- مسیرهای روتر ---
    path('api/', include(routers.urlpatterns)),

    # --- برای آپلود فایل ---
    path('ckeditor/', include('ckeditor_uploader.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
