# store/serializers.py
from django.utils import timezone
from rest_framework import serializers
from .models import (
    Product, Order, OrderItem, Category, Brand, Banner, Discount, 
    Specification, ProductImage, SitePage, FooterColumn, 
    FooterLink, SocialMediaLink, TrustSeal, Province, City, Address,
    ShippingMethod, Coupon, PromoBanner
)

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ('id', 'name', 'logo')

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'children')
    def get_children(self, obj):
        return CategorySerializer(obj.children.all(), many=True).data

class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specification
        fields = ('name', 'value')

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image',)

class ProductSerializer(serializers.ModelSerializer):
    final_price = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    is_special_offer = serializers.SerializerMethodField()
    special_offer_end_date = serializers.SerializerMethodField()
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    max_quantity_per_user = serializers.SerializerMethodField()
    specifications = SpecificationSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'description', 'review',
            'price', 'image', 'stock',
            'brand', 'category', 'final_price', 'discount_percentage', 
            'is_special_offer', 'special_offer_end_date',
            'specifications', 'images', 'max_quantity_per_user'
        )

    def get_active_discount_instance(self, obj):
        if hasattr(obj, 'active_discount') and obj.active_discount:
            return obj.active_discount[0]
        return None
    
    def get_max_quantity_per_user(self, obj):
        discount_instance = self.get_active_discount_instance(obj)
        if discount_instance:
            return discount_instance.max_quantity_per_user
        return None

    def get_is_special_offer(self, obj):
        return self.get_active_discount_instance(obj) is not None

    def get_special_offer_end_date(self, obj):
        discount_instance = self.get_active_discount_instance(obj)
        return discount_instance.discount.end_date if discount_instance else None

    def get_final_price(self, obj):
        discount_instance = self.get_active_discount_instance(obj)
        if not discount_instance:
            return obj.price

        if discount_instance.discount_type == 'PERCENTAGE':
            return obj.price - (obj.price * discount_instance.discount_value / 100)
        elif discount_instance.discount_type == 'FIXED_PRICE':
            return discount_instance.discount_value
        return obj.price

    def get_discount_percentage(self, obj):
        discount_instance = self.get_active_discount_instance(obj)
        if not discount_instance:
            return 0

        if discount_instance.discount_type == 'PERCENTAGE':
            return discount_instance.discount_value
        elif discount_instance.discount_type == 'FIXED_PRICE':
            if obj.price > 0:
                return round((1 - (discount_instance.discount_value / obj.price)) * 100)
        return 0
    

class ProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name',)

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductMiniSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ("id", "price", "product", "quantity")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ("id", "full_name", "address", "city", "postal_code", "created_at", "total_paid", "status", "items")

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    coupon_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    class Meta:
        model = Order
        fields = ("full_name", "address", "city", "postal_code", "total_paid", "items")

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'image', 'link')

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ('name', 'end_date', 'background_color')

class SitePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitePage
        fields = ('title', 'slug', 'content', 'latitude', 'longitude')

class FooterLinkSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source='page.slug', read_only=True)
    text = serializers.CharField(source='page.title', read_only=True)
    class Meta:
        model = FooterLink
        fields = ('text', 'slug')

class FooterColumnSerializer(serializers.ModelSerializer):
    links = FooterLinkSerializer(many=True, read_only=True)
    class Meta:
        model = FooterColumn
        fields = ('title', 'links')

class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ('name', 'url', 'icon_svg')

class TrustSealSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustSeal
        fields = ('name', 'image', 'url')

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('id', 'name')

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ('id', 'name')

class AddressSerializer(serializers.ModelSerializer):
    province_name = serializers.CharField(source='province.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    class Meta:
        model = Address
        fields = ('id', 'full_name', 'phone_number', 'province', 'province_name', 'city', 'city_name', 'address_line_1', 'postal_code', 'is_default')
        extra_kwargs = {
            'province': {'write_only': True},
            'city': {'write_only': True},
        }

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = ('id', 'name', 'description', 'price', 'logo')

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('id', 'code', 'discount_type', 'value')

    def validate(self, data):
        """
        چک می‌کند که اگر نوع تخفیf درصدی است، مقدار آن بیشتر از ۱۰۰ نباشد.
        """
        if data.get('discount_type') == 'PERCENT' and data.get('value') > 100:
            raise serializers.ValidationError("مقدار تخفیف درصدی نمی‌تواند بیشتر از ۱۰۰ باشد.")
        return data

class PromoBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoBanner
        fields = ('title', 'image', 'link')

class HomePageSerializer(serializers.Serializer):
    """
    این سریالایزر داده‌های مدل‌های مختلف را برای صفحه اصلی جمع‌آوری می‌کند.
    """
    banners = BannerSerializer(many=True)
    special_offers = ProductSerializer(many=True)
    promo_banners = PromoBannerSerializer(many=True)
    featured_brands = BrandSerializer(many=True)