# store/models.py
from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField
from django.core.validators import MinValueValidator

class Category(models.Model):
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', verbose_name="دسته‌بندی والد")
    name = models.CharField("نام دسته‌بندی", max_length=255, db_index=True)
    slug = models.SlugField("اسلاگ (آدرس)", max_length=255, unique=True)
    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField("نام برند", max_length=255, unique=True)
    logo = models.ImageField("لوگو", upload_to='brands/', null=True, blank=True)
    is_featured = models.BooleanField("ویژه", default=False)
    class Meta:
        verbose_name = "برند"
        verbose_name_plural = "برندها"
    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="دسته‌بندی")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, verbose_name="برند")
    name = models.CharField("نام محصول", max_length=255)
    description = models.TextField("توضیحات کوتاه (برای مشاهده سریع)", blank=True)
    review = RichTextField("نقد و بررسی تخصصی", blank=True, null=True)
    price = models.DecimalField("قیمت", max_digits=10, decimal_places=0)
    image = models.ImageField("تصویر اصلی محصول", upload_to='products/')
    stock = models.PositiveIntegerField("موجودی انبار", default=0)
    is_active = models.BooleanField("فعال", default=True)
    created_at = models.DateTimeField("تاریخ ایجاد", auto_now_add=True)
    updated_at = models.DateTimeField("تاریخ بروزرسانی", auto_now=True)
    
    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ('-created_at',)

    def __str__(self):
        return self.name


class Discount(models.Model):
    name = models.CharField("نام رویداد تخفیف", max_length=255)
    products = models.ManyToManyField(Product, through='DiscountedProduct', related_name='discount_events', verbose_name="محصولات")
    start_date = models.DateTimeField("تاریخ شروع")
    end_date = models.DateTimeField("تاریخ پایان")
    is_active = models.BooleanField("فعال", default=True)
    background_color = models.CharField(
        "کد رنگ پس‌زمینه (اختیاری)", 
        max_length=30, 
        blank=True, 
        help_text="مانند: #C5E8B7 یا linear-gradient(90deg, #1A2980 0%, #26D0CE 100%)"
    )

    class Meta:
        verbose_name = "رویداد تخفیف"
        verbose_name_plural = "مدیریت رویدادهای تخفیف"

    def __str__(self):
        return self.name

class DiscountedProduct(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('PERCENTAGE', 'درصد'),
        ('FIXED_PRICE', 'مبلغ نهایی'),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="محصول")
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, verbose_name="رویداد تخفیف")
    discount_type = models.CharField("نوع تخفیف", max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField("مقدار تخفیف", max_digits=10, decimal_places=0, help_text="اگر نوع «درصد» است، عدد بین ۱ تا ۱۰۰ وارد کنید. اگر «مبلغ نهایی» است، قیمت فروش پس از تخفیف را به تومان وارد کنید.")
    max_quantity_per_user = models.PositiveIntegerField(
        "حداکثر تعداد خرید برای هر کاربر", 
        null=True, 
        blank=True,
        help_text="اگر خالی بماند، محدودیتی اعمال نمی‌شود."
    )

    class Meta:
        verbose_name = "محصول تخفیف‌دار"
        verbose_name_plural = "محصولات تخفیف‌دار"
        unique_together = ('product', 'discount')

class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('PERCENT', 'درصدی'),
        ('FIXED', 'مبلغ ثابت'),
    ]
    usage_count = models.PositiveIntegerField("تعداد استفاده شده", default=0, editable=False)
    code = models.CharField("کد تخفیف", max_length=50, unique=True)
    valid_from = models.DateTimeField("معتبر از تاریخ")
    valid_to = models.DateTimeField("معتبر تا تاریخ")
    discount_type = models.CharField("نوع تخفیف", max_length=10, choices=DISCOUNT_TYPE_CHOICES)
    value = models.IntegerField("مقدار تخفیف", validators=[MinValueValidator(0)])
    min_purchase_amount = models.DecimalField(
        "حداقل مبلغ خرید", max_digits=10, decimal_places=0, default=0
    )
    max_usage_total = models.PositiveIntegerField(
        "حداکثر تعداد استفاده (برای همه)", null=True, blank=True
    )
    max_usage_per_user = models.PositiveIntegerField(
        "حداکثر تعداد استفاده (برای هر کاربر)", default=1
    )
    usage_count = models.PositiveIntegerField("تعداد استفاده شده", default=0, editable=False)
    specific_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE
    )
    is_active = models.BooleanField("فعال", default=True)
    class Meta:
        verbose_name = "کوپن تخفیف"
        verbose_name_plural = "۹. مدیریت کوپن‌های تخفیف"
    def __str__(self):
        return self.code

class Order(models.Model):
    STATUS_CHOICES = [('PROCESSING', 'در حال پردازش'), ('SHIPPED', 'ارسال شده'), ('DELIVERED', 'تحویل داده شده'), ('CANCELLED', 'لغو شده')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders', verbose_name="کاربر")
    full_name = models.CharField("نام کامل", max_length=255)
    address = models.CharField("آدرس", max_length=500)
    city = models.CharField("شهر", max_length=100)
    postal_code = models.CharField("کد پستی", max_length=20)
    created_at = models.DateTimeField("تاریخ ایجاد", auto_now_add=True)
    total_paid = models.DecimalField("مبلغ کل", max_digits=10, decimal_places=0)
    status = models.CharField("وضعیت سفارش", max_length=20, choices=STATUS_CHOICES, default='PROCESSING') # <-- فیلد وضعیت
    coupon = models.ForeignKey(
        Coupon, 
        related_name='orders', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        verbose_name="کوپن استفاده شده"
    )
    discount_amount = models.DecimalField(
        "مبلغ تخفیف", max_digits=10, decimal_places=0, default=0
    )


    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"
        ordering = ('-created_at',)

    def __str__(self):
        return f"سفارش {self.id} توسط {self.user.username}"
    
    def get_total_cost_before_discount(self):
        return sum(item.get_cost() for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE, verbose_name="سفارش")
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE, verbose_name="محصول")
    price = models.DecimalField("قیمت", max_digits=10, decimal_places=0)
    quantity = models.PositiveIntegerField("تعداد", default=1)

    class Meta:
        verbose_name = "آیتم سفارش"
        verbose_name_plural = "آیتم‌های سفارش"
        
    def get_cost(self):
        return self.price * self.quantity

    def __str__(self):
        return str(self.id)
    
class Banner(models.Model):
    title = models.CharField("عنوان بنر", max_length=255)
    image = models.ImageField("تصویر بنر (۱۹۲۰x۵۰۰)", upload_to='banners/')
    link = models.URLField("لینک (مقصد)", help_text="لینکی که کاربر با کلیک روی بنر به آن هدایت می‌شود.")
    is_active = models.BooleanField("فعال", default=True, help_text="فقط بنرهای فعال نمایش داده می‌شوند.")

    class Meta:
        verbose_name = "بنر"
        verbose_name_plural = "بنرها"

    def __str__(self):
        return self.title
    
class Specification(models.Model):
    product = models.ForeignKey(Product, related_name='specifications', on_delete=models.CASCADE, verbose_name="محصول")
    name = models.CharField("نام مشخصه", max_length=255)
    value = models.CharField("مقدار مشخصه", max_length=255)

    class Meta:
        verbose_name = "مشخصه فنی"
        verbose_name_plural = "مشخصات فنی"

    def __str__(self):
        return f"{self.name}: {self.value}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, verbose_name="محصول")
    image = models.ImageField("تصویر", upload_to='products/gallery/')

    class Meta:
        verbose_name = "تصویر محصول"
        verbose_name_plural = "گالری تصاویر"

    def __str__(self):
        return f"تصویر برای {self.product.name}"

# --- مدل‌های مدیریت محتوا ---
class SitePage(models.Model):
    title = models.CharField("عنوان صفحه", max_length=255)
    slug = models.SlugField("اسلاگ (آدرس)", max_length=255, unique=True)
    content = RichTextField("محتوای صفحه")
    is_published = models.BooleanField("منتشر شده", default=True)
    latitude = models.FloatField("عرض جغرافیایی (Latitude)", null=True, blank=True)
    longitude = models.FloatField("طول جغرافیایی (Longitude)", null=True, blank=True)
    class Meta:
        verbose_name = "صفحه سایت"
        verbose_name_plural = "۱. مدیریت صفحات سایت"
    def __str__(self):
        return self.title

class FooterColumn(models.Model):
    title = models.CharField("عنوان ستون", max_length=100)
    order = models.PositiveIntegerField("ترتیب نمایش", default=0)
    class Meta:
        verbose_name = "ستون فوتر"
        verbose_name_plural = "۲. مدیریت ستون‌های فوتر"
        ordering = ['order']
    def __str__(self):
        return self.title

class FooterLink(models.Model):
    column = models.ForeignKey(FooterColumn, related_name='links', on_delete=models.CASCADE, verbose_name="ستون والد")
    page = models.ForeignKey(SitePage, on_delete=models.CASCADE, verbose_name="لینک به صفحه")
    order = models.PositiveIntegerField("ترتیب نمایش", default=0)
    class Meta:
        verbose_name = "لینک فوتر"
        verbose_name_plural = "لینک‌های فوتر"
        ordering = ['order']
    def __str__(self):
        return self.page.title

class SocialMediaLink(models.Model):
    name = models.CharField("نام شبکه اجتماعی", max_length=50)
    url = models.URLField("لینک")
    icon_svg = models.TextField("کد SVG آیکون")
    order = models.PositiveIntegerField("ترتیب نمایش", default=0)
    class Meta:
        verbose_name = "لینک شبکه اجتماعی"
        verbose_name_plural = "۳. مدیریت شبکه‌های اجتماعی"
        ordering = ['order']
    def __str__(self):
        return self.name

class TrustSeal(models.Model):
    name = models.CharField("نام نماد", max_length=100)
    image = models.ImageField("تصویر نماد", upload_to='seals/')
    url = models.URLField("لینک")
    order = models.PositiveIntegerField("ترتیب نمایش", default=0)
    class Meta:
        verbose_name = "نماد اعتماد"
        verbose_name_plural = "۴. مدیریت نمادهای اعتماد"
        ordering = ['order']
    def __str__(self):
        return self.name

class ShippingMethod(models.Model):
    name = models.CharField("نام روش ارسال", max_length=255)
    description = models.CharField("توضیحات", max_length=500, blank=True)
    price = models.DecimalField("هزینه", max_digits=10, decimal_places=0)
    logo = models.ImageField("لوگو", upload_to='shipping/', null=True, blank=True)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "روش ارسال"
        verbose_name_plural = "۵. مدیریت روش‌های ارسال"

    def __str__(self):
        return self.name

class Province(models.Model):
    name = models.CharField("نام استان", max_length=100, unique=True)
    class Meta:
        verbose_name = "استان"
        verbose_name_plural = "۷. مدیریت استان‌ها"
    def __str__(self):
        return self.name

class City(models.Model):
    province = models.ForeignKey(Province, related_name='cities', on_delete=models.CASCADE, verbose_name="استان")
    name = models.CharField("نام شهر", max_length=100)
    class Meta:
        verbose_name = "شهر"
        verbose_name_plural = "۸. مدیریت شهرها"
    def __str__(self):
        return self.name

class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addresses', on_delete=models.CASCADE, verbose_name="کاربر")
    full_name = models.CharField("نام کامل گیرنده", max_length=255)
    phone_number = models.CharField("شماره تماس", max_length=20)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, verbose_name="استان")
    city = models.ForeignKey(City, on_delete=models.PROTECT, verbose_name="شهر")
    address_line_1 = models.CharField("آدرس", max_length=500)
    postal_code = models.CharField("کد پستی", max_length=20)
    is_default = models.BooleanField("آدرس پیش‌فرض", default=False)
    class Meta:
        verbose_name = "آدرس"
        verbose_name_plural = "۶. مدیریت آدرس‌ها"

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user).update(is_default=False)
        super().save(*args, **kwargs)


# --- مدل تنظیمات فاکتور ---
class InvoiceSetting(models.Model):
    company_name = models.CharField("نام شرکت", max_length=255, default="آتن PC")
    company_logo = models.ImageField("لوگوی شرکت", upload_to='invoices/logos/', null=True, blank=True)
    company_address = models.TextField("آدرس شرکت", blank=True)
    company_phone = models.CharField("تلفن شرکت", max_length=20, blank=True)
    invoice_notes = models.TextField("یادداشت‌های پایین فاکتور", blank=True)

    class Meta:
        verbose_name = "تنظیمات فاکتور"
        verbose_name_plural = "تنظیمات فاکتور"

    def __str__(self):
        return "تنظیمات فاکتور"
    
class PromoBanner(models.Model):
    title = models.CharField("عنوان", max_length=100)
    image = models.ImageField("تصویر بنر", upload_to='promo_banners/')
    link = models.URLField("لینک مقصد")
    order = models.PositiveIntegerField("ترتیب نمایش", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "بنر تبلیغاتی"
        verbose_name_plural = "بنرهای تبلیغاتی"
        ordering = ['order']

    def __str__(self):
        return self.title