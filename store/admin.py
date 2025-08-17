# store/admin.py
from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.utils import timezone
from django.utils.crypto import get_random_string
from datetime import timedelta
from .forms import CouponGenerationForm
from .models import (
    Category, Brand, Product, Order, OrderItem, Banner, Discount, 
    DiscountedProduct, Specification, ProductImage, SitePage,
    FooterColumn, FooterLink, SocialMediaLink, TrustSeal,
    Province, City, Address, ShippingMethod, Coupon, InvoiceSetting,
    PromoBanner
)

@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active')
    list_editable = ('price', 'is_active')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('parent',)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_featured')
    list_editable = ('is_featured',)

class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 1

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'stock', 'is_active')
    list_filter = ('is_active', 'category', 'brand')
    list_editable = ('price', 'stock', 'is_active')
    search_fields = ('name', 'review')
    inlines = [SpecificationInline, ProductImageInline]

class DiscountedProductInline(admin.TabularInline):
    model = DiscountedProduct
    extra = 1
    fields = ('product', 'discount_type', 'discount_value', 'max_quantity_per_user')

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'is_active')
    fields = ('name', 'start_date', 'end_date', 'background_color', 'is_active')
    inlines = [DiscountedProductInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'total_paid', 'status')
    list_filter = ('status', 'created_at',)
    list_editable = ('status',)
    inlines = [OrderItemInline]
    
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'is_active')
    list_editable = ('is_active',)

@admin.register(SitePage)
class SitePageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'content', 'is_published')}),
        ('موقعیت مکانی (اختیاری)', {'fields': ('latitude', 'longitude'), 'classes': ('collapse',)}),
    )

class FooterLinkInline(admin.TabularInline):
    model = FooterLink
    extra = 1

@admin.register(FooterColumn)
class FooterColumnAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    inlines = [FooterLinkInline]

@admin.register(SocialMediaLink)
class SocialMediaLinkAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'order')

@admin.register(TrustSeal)
class TrustSealAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'order')

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'province')
    list_filter = ('province',)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'city', 'is_default')
    list_filter = ('city', 'is_default')
    search_fields = ('full_name', 'address_line_1', 'user__username')
    
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'valid_to', 'discount_type', 'value', 'is_active', 'usage_count')
    list_filter = ('is_active', 'valid_from', 'valid_to')
    search_fields = ('code',)
    readonly_fields = ('usage_count',)
    change_list_template = "admin/store/coupon/changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('generate-coupons/', self.admin_site.admin_view(self.generate_coupons_view), name='generate_coupons'),
        ]
        return custom_urls + urls

    def generate_coupons_view(self, request):
        if request.method == 'POST':
            form = CouponGenerationForm(request.POST)
            if form.is_valid():
                count = form.cleaned_data['count']
                length = form.cleaned_data['length']
                now = timezone.now()
                valid_to = now + timedelta(days=form.cleaned_data['valid_for_days'])
                
                for i in range(count):
                    while True:
                        code = get_random_string(length).upper()
                        if not Coupon.objects.filter(code=code).exists():
                            break
                    
                    Coupon.objects.create(
                        code=code,
                        discount_type=form.cleaned_data['discount_type'],
                        value=form.cleaned_data['value'],
                        valid_from=now,
                        valid_to=valid_to
                    )
                self.message_user(request, f"{count} کوپن جدید با موفقیت تولید شد.")
                return redirect('..')
        else:
            form = CouponGenerationForm()

        context = self.admin_site.each_context(request)
        context['form'] = form
        context['title'] = "تولید کوپن تخفیف جدید"
        return render(request, 'admin/coupon_generate_form.html', context)


@admin.register(InvoiceSetting)
class InvoiceSettingAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return InvoiceSetting.objects.count() == 0

@admin.register(PromoBanner)
class PromoBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'order', 'is_active')
    list_editable = ('order', 'is_active')