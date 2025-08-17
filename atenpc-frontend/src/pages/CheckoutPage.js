// src/pages/CheckoutPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { Select, Button } from 'antd';
import { formatPrice } from '../utils/formatters';
import './CheckoutPage.css';

const { Option } = Select;

const CheckoutPage = () => {
  const { cartItems, clearCart, appliedCoupon } = useContext(CartContext);
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens) return;
      try {
        const [addressRes, shippingRes] = await Promise.all([
          api.get('/addresses/', {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
          }),
          api.get('/shipping-methods/')
        ]);

        const userAddresses = addressRes.data.results || addressRes.data;
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          const defaultAddress = userAddresses.find(addr => addr.is_default) || userAddresses[0];
          setSelectedAddress(defaultAddress);
        }

        const shippingOptions = shippingRes.data.results || shippingRes.data;
        setShippingMethods(shippingOptions);
        if (shippingOptions.length > 0) {
          setSelectedShipping(shippingOptions[0]);
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    };
    fetchData();
  }, [authTokens]);

  const itemsOriginalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.original_price || item.price) * item.quantity), 0);
  const itemsFinalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const productDiscount = itemsOriginalPrice - itemsFinalPrice;
  const shippingPrice = selectedShipping ? parseFloat(selectedShipping.price) : 0;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'PERCENT') {
      couponDiscount = (itemsFinalPrice * appliedCoupon.value) / 100;
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  const totalDiscount = productDiscount + couponDiscount;
  const finalPrice = (itemsFinalPrice + shippingPrice) - couponDiscount;

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error("لطفاً یک آدرس را انتخاب کنید.");
      return;
    }

    const orderData = {
      full_name: selectedAddress.full_name,
      address: selectedAddress.address_line_1,
      city: selectedAddress.city_name,
      postal_code: selectedAddress.postal_code,
      total_paid: itemsFinalPrice + shippingPrice, // مبلغ قبل از اعمال کوپن
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      items: cartItems.map(item => ({
        product: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post('/orders/create/', orderData, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` },
      });
      toast.success('سفارش شما با موفقیت ثبت شد!');
      clearCart();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'مشکلی در ثبت سفارش شما پیش آمد.');
    }
  };

  return (
    <main className="main-content">
      <div className="checkout-page">
        <h2>نهایی کردن خرید</h2>
        <div className="checkout-layout">
          <div className="checkout-details">
            <h3>آدرس تحویل</h3>
            <Select 
              placeholder="آدرس خود را انتخاب کنید" 
              style={{ width: '100%', marginBottom: '1rem' }}
              onChange={(value) => setSelectedAddress(addresses.find(a => a.id === value))}
              value={selectedAddress?.id}
            >
              {addresses.map(addr => (
                <Option key={addr.id} value={addr.id}>
                  {addr.address_line_1}, {addr.city_name}
                </Option>
              ))}
            </Select>
            <Link to="/dashboard/addresses" className="manage-address-link">مدیریت آدرس‌ها</Link>

            <h3 style={{marginTop: '2rem'}}>روش ارسال</h3>
            {shippingMethods.map(method => (
              <label key={method.id} className="shipping-option">
                <input 
                  type="radio" 
                  name="shipping" 
                  value={method.id}
                  checked={selectedShipping?.id === method.id}
                  onChange={() => setSelectedShipping(method)}
                />
                <div className="shipping-details">
                  <span>{method.name}</span>
                  <span className="shipping-price">{formatPrice(method.price)} تومان</span>
                </div>
              </label>
            ))}
          </div>

          <div className="checkout-summary">
            <h3>خلاصه سفارش</h3>
            <div className="summary-row">
              <span>قیمت کالاها ({formatPrice(cartItems.length)})</span>
              <span>{formatPrice(itemsOriginalPrice)} تومان</span>
            </div>
            {totalDiscount > 0 && (
              <div className="summary-row discount">
                <span>سود شما از خرید</span>
                <span>- {formatPrice(totalDiscount)} تومان</span>
              </div>
            )}
            <div className="summary-row">
              <span>هزینه ارسال</span>
              <span>{formatPrice(shippingPrice)} تومان</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>مبلغ قابل پرداخت</span>
              <span>{formatPrice(finalPrice)} تومان</span>
            </div>
            <Button type="primary" block onClick={handleSubmit} className="place-order-button">
              پرداخت و ثبت نهایی سفارش
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;