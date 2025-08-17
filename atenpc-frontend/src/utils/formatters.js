// src/utils/formatters.js
export const formatPrice = (price) => {
  // ورودی را به عدد تبدیل می‌کنیم
  const num = parseFloat(price);

  // چک می‌کنیم که آیا نتیجه یک عدد معتبر است یا نه
  if (isNaN(num)) {
    return '۰'; // اگر عدد نبود، صفر فارسی را برگردان
  }

  // اگر عدد معتبر بود، آن را با اعداد فارسی فرمت‌بندی کن
  return num.toLocaleString('fa-IR', { numberingSystem: 'persian' });
};