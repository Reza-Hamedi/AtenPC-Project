# store/views.py
from django.utils import timezone
from django.db import transaction
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Prefetch
from rest_framework import generics, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from rest_framework import status

from .models import (
    Product, Order, Category, Banner, Brand, Discount, SitePage, 
    FooterColumn, SocialMediaLink, TrustSeal, ShippingMethod, 
    Province, City, Address, Coupon, InvoiceSetting, PromoBanner,
    DiscountedProduct
)
from .serializers import (
    ProductSerializer, OrderSerializer, OrderCreateSerializer,
    CategorySerializer, BannerSerializer, BrandSerializer, 
    DiscountSerializer, SitePageSerializer, FooterColumnSerializer, 
    SocialMediaLinkSerializer, TrustSealSerializer, ShippingMethodSerializer,
    ProvinceSerializer, CitySerializer, AddressSerializer, CouponSerializer,
    PromoBannerSerializer, HomePageSerializer
)

# ---شروع View تجمیع داده‌های صفحه اصلی ---
class HomePageDataView(APIView):
    """
    این View تمام داده‌های مورد نیاز برای رندر اولیه صفحه اصلی را
    در یک درخواست واحد و بهینه جمع‌آوری و ارسال می‌کند.
    """
    def get(self, request, *args, **kwargs):
        # دریافت بنرهای اصلی
        banners = Banner.objects.filter(is_active=True)
        
        # دریافت محصولات شگفت‌انگیز (به صورت بهینه)
        now = timezone.now()
        active_discounted_products = DiscountedProduct.objects.filter(
            discount__is_active=True, discount__start_date__lte=now, discount__end_date__gte=now
        ).select_related('discount')
        product_ids = active_discounted_products.values_list('product_id', flat=True)
        special_offers = Product.objects.filter(id__in=product_ids, is_active=True).prefetch_related(
            Prefetch('discountedproduct_set', queryset=active_discounted_products, to_attr='active_discount')
        )
        
        # دریافت بنرهای تبلیغاتی
        promo_banners = PromoBanner.objects.filter(is_active=True)
        
        # دریافت برندهای ویژه
        featured_brands = Brand.objects.filter(is_featured=True)

        # بسته‌بندی داده‌ها برای سریالایزر
        data = {
            'banners': banners,
            'special_offers': special_offers,
            'promo_banners': promo_banners,
            'featured_brands': featured_brands,
        }
        
        serializer = HomePageSerializer(instance=data, context={'request': request})
        return Response(serializer.data)
# --- پایان ---

class BannerListView(generics.ListAPIView):
    queryset = Banner.objects.filter(is_active=True)
    serializer_class = BannerSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer

class SpecialOfferListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        now = timezone.now()
        active_discounted_products = DiscountedProduct.objects.filter(
            discount__is_active=True,
            discount__start_date__lte=now,
            discount__end_date__gte=now
        ).select_related('discount') # برای بهینه‌سازی

        product_ids = active_discounted_products.values_list('product_id', flat=True)
        
        return Product.objects.filter(
            id__in=product_ids, is_active=True
        ).prefetch_related(
            Prefetch('discountedproduct_set', queryset=active_discounted_products, to_attr='active_discount')
        )

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer    
    def get_queryset(self):
        now = timezone.now()
        active_discounted_products = DiscountedProduct.objects.filter(
            discount__is_active=True,
            discount__start_date__lte=now,
            discount__end_date__gte=now
        ).select_related('discount')        
        queryset = Product.objects.filter(is_active=True).prefetch_related(
            Prefetch('discountedproduct_set', queryset=active_discounted_products, to_attr='active_discount'),
            'category', 'brand'
        )        
        query = self.request.query_params.get('query', None)
        category_slug = self.request.query_params.get('category_slug', None)
        if query:
            queryset = queryset.filter(name__icontains=query)        
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                descendants = self.get_all_descendants(category)
                all_category_ids = [category.id] + [cat.id for cat in descendants]
                queryset = queryset.filter(category_id__in=all_category_ids)
            except Category.DoesNotExist:
                return queryset.none()
        
        return queryset.distinct()
    
    def get_all_descendants(self, category):
        descendants = list(category.children.all())
        for child in category.children.all():
            descendants.extend(self.get_all_descendants(child))
        return descendants

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        now = timezone.now()
        active_discounted_products = DiscountedProduct.objects.filter(
            discount__is_active=True,
            discount__start_date__lte=now,
            discount__end_date__gte=now
        ).select_related('discount')
        
        return Product.objects.filter(is_active=True).prefetch_related(
            Prefetch('discountedproduct_set', queryset=active_discounted_products, to_attr='active_discount'),
            'category', 'brand', 'images', 'specifications'
        )

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.filter(is_featured=True)
    serializer_class = BrandSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        items_data = serializer.validated_data.get('items')
        total_paid = serializer.validated_data.get('total_paid')
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            if product.stock < quantity:
                return Response({'error': f'موجودی محصول "{product.name}" کافی نیست.'}, status=status.HTTP_400_BAD_REQUEST)
            product.stock -= quantity
            product.save()

        coupon_code = request.data.get('coupon_code')
        coupon = None
        discount_amount = 0
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code, is_active=True)
                # (اعتبارسنجی دوباره برای امنیت بیشتر در لحظه ثبت نهایی)
                if coupon.discount_type == 'PERCENT':
                    discount_amount = (total_paid * coupon.value) / 100
                else: # FIXED
                    discount_amount = coupon.value
                
                total_paid -= discount_amount
                
                coupon.usage_count += 1
                coupon.save()
            except Coupon.DoesNotExist:
                pass

        order = serializer.save(user=request.user, coupon=coupon, discount_amount=discount_amount, total_paid=total_paid)
        
        headers = self.get_success_headers(serializer.data)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED, headers=headers)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class ActiveDiscountView(generics.RetrieveAPIView):
    serializer_class = DiscountSerializer
    def get_object(self):
        now = timezone.now()
        return Discount.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        ).first()
    
class SitePageView(generics.RetrieveAPIView):
    queryset = SitePage.objects.filter(is_published=True)
    serializer_class = SitePageSerializer
    lookup_field = 'slug'

class FooterDataView(generics.ListAPIView):
    queryset = FooterColumn.objects.all()
    serializer_class = FooterColumnSerializer
    pagination_class = None

class SocialMediaLinkView(generics.ListAPIView):
    queryset = SocialMediaLink.objects.all()
    serializer_class = SocialMediaLinkSerializer
    pagination_class = None

class TrustSealView(generics.ListAPIView):
    queryset = TrustSeal.objects.all()
    serializer_class = TrustSealSerializer
    pagination_class = None

class ShippingMethodView(generics.ListAPIView):
    queryset = ShippingMethod.objects.filter(is_active=True)
    serializer_class = ShippingMethodSerializer
    pagination_class = None

class ProvinceListView(generics.ListAPIView):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    pagination_class = None

class CityListView(generics.ListAPIView):
    serializer_class = CitySerializer
    pagination_class = None
    def get_queryset(self):
        province_id = self.request.query_params.get('province_id')
        if province_id:
            return City.objects.filter(province_id=province_id)
        return City.objects.none()

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RelatedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        product_id = self.kwargs.get('pk')
        try:
            product = Product.objects.get(pk=product_id)
            return Product.objects.filter(
                category=product.category, is_active=True
            ).exclude(pk=product_id)[:5]
        except Product.DoesNotExist:
            return Product.objects.none()

class ValidateCouponView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'کد تخفیف ارسال نشده است.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            now = timezone.now()
            coupon = Coupon.objects.get(
                code__iexact=code,
                valid_from__lte=now,
                valid_to__gte=now,
                is_active=True
            )

            if coupon.specific_user and coupon.specific_user != request.user:
                 return Response({'error': 'این کد تخفیف برای شما معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)

            if coupon.max_usage_total is not None and coupon.usage_count >= coupon.max_usage_total:
                return Response({'error': 'ظرفیت استفاده از این کد تخفیف به اتمام رسیده است.'}, status=status.HTTP_400_BAD_REQUEST)

            user_usage = Order.objects.filter(user=request.user, coupon=coupon).count()
            if user_usage >= coupon.max_usage_per_user:
                return Response({'error': f'شما قبلاً {coupon.max_usage_per_user} بار از این کد استفاده کرده‌اید.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = CouponSerializer(coupon)
            return Response(serializer.data)

        except Coupon.DoesNotExist:
            return Response({'error': 'کد تخفیف نامعتبر است.'}, status=status.HTTP_400_BAD_REQUEST)

class InvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            settings_obj = InvoiceSetting.objects.first()            
            logo_url = ''
            if settings_obj and settings_obj.company_logo:
                logo_url = request.build_absolute_uri(settings_obj.company_logo.url)
            
            return render(request, 'store/invoice_template.html', {
                'order': order,
                'settings': settings_obj,
                'logo_url': logo_url,
            })
        except Order.DoesNotExist:
            return HttpResponse('سفارش یافت نشد یا شما به آن دسترسی ندارید.', status=404)
    
class CartRecommendationsView(APIView):
    def post(self, request, *args, **kwargs):
        product_ids = request.data.get('product_ids', [])
        if not product_ids:
            return Response([])

        categories = Product.objects.filter(id__in=product_ids).values_list('category', flat=True).distinct()
        
        related_products = Product.objects.filter(
            category__in=categories, 
            is_active=True
        ).exclude(
            id__in=product_ids
        ).order_by('?')[:10]
        
        serializer = ProductSerializer(related_products, many=True, context={'request': request})
        return Response(serializer.data)
    
class PromoBannerView(generics.ListAPIView):
    queryset = PromoBanner.objects.filter(is_active=True)
    serializer_class = PromoBannerSerializer
    pagination_class = None

class ProductsByIdsView(APIView):
    def post(self, request, *args, **kwargs):
        product_ids = request.data.get('product_ids', [])
        if not product_ids:
            return Response([])

        products = list(Product.objects.filter(id__in=product_ids, is_active=True))
        products.sort(key=lambda p: product_ids.index(p.id))

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)