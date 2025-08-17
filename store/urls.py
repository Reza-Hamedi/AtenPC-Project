# store/urls.py
from django.urls import path
from . import views

app_name = 'store'

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product_list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('banners/', views.BannerListView.as_view(), name='banner_list'),
    path('brands/', views.BrandListView.as_view(), name='brand_list'),
    path('discounts/active/', views.ActiveDiscountView.as_view(), name='active_discount'),
    path('products/special-offers/', views.SpecialOfferListView.as_view(), name='special_offers'),
    path('provinces/', views.ProvinceListView.as_view(), name='province_list'),
    path('cities/', views.CityListView.as_view(), name='city_list'),
    path('addresses/', views.AddressViewSet.as_view({'get': 'list', 'post': 'create'}), name='address-list'),
    path('addresses/<int:pk>/', views.AddressViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='address-detail'),
    path('orders/', views.OrderListView.as_view(), name='order_list'),
    path('orders/create/', views.OrderCreateView.as_view(), name='order_create'),
    path('pages/<slug:slug>/', views.SitePageView.as_view(), name='sitepage_detail'),
    path('footer-columns/', views.FooterDataView.as_view(), name='footer_columns'),
    path('social-media/', views.SocialMediaLinkView.as_view(), name='social_media'),
    path('trust-seals/', views.TrustSealView.as_view(), name='trust_seals'),
    path('shipping-methods/', views.ShippingMethodView.as_view(), name='shipping_methods'),
    path('coupons/validate/', views.ValidateCouponView.as_view(), name='validate_coupon'),
    path('cart-recommendations/', views.CartRecommendationsView.as_view(), name='cart_recommendations'),
    path('products/<int:productId>/related/', views.RelatedProductsView.as_view(), name='related-products'),
    path('products/by_ids/', views.ProductsByIdsView.as_view(), name='products_by_ids'),
    path('orders/<int:order_id>/invoice/', views.InvoiceView.as_view(), name='view_invoice'),
    path('promo-banners/', views.PromoBannerView.as_view(), name='promo_banners'),
    path('homepage-data/', views.HomePageDataView.as_view(), name='homepage_data'),
]