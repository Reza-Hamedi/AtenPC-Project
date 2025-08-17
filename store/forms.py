# store/forms.py
from django import forms

class CouponGenerationForm(forms.Form):
    DISCOUNT_TYPE_CHOICES = [
        ('PERCENT', 'درصدی'),
        ('FIXED', 'مبلغ ثابت'),
    ]
    count = forms.IntegerField(label="تعداد کوپن برای تولید", min_value=1, initial=1)
    length = forms.IntegerField(label="طول کد (تعداد کاراکتر)", min_value=6, max_value=20, initial=8)
    discount_type = forms.ChoiceField(label="نوع تخفیف", choices=DISCOUNT_TYPE_CHOICES)
    value = forms.IntegerField(label="مقدار تخفیف", min_value=1)
    valid_for_days = forms.IntegerField(label="مدت اعتبار (به روز)", min_value=1, initial=30)