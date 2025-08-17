# atenpc_project/routers.py
from rest_framework.routers import DefaultRouter
from store import views

router = DefaultRouter()
router.register(r'addresses', views.AddressViewSet, basename='address')

urlpatterns = router.urls