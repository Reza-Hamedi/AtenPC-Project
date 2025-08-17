// src/pages/CartPage.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatters';
import CartRecommendations from '../components/CartRecommendations'; 
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { Input, Button } from 'antd';
import './CartPage.css';

const CartPage = () => {
  // --- تغییر اصلی: دریافت authTokens از AuthContext ---
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, appliedCoupon, applyCoupon, removeCoupon } = useContext(CartContext);
  const { authTokens } = useContext(AuthContext); 
  const [couponCode, setCouponCode] = useState('');

  // محاسبه مجموع قیمت اصلی کالاها
  const itemsOriginalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.original_price) * item.quantity), 0);
  // محاسبه مجموع قیمت پرداختی برای کالاها
  const itemsFinalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  // محاسبه تخفیف خود کالاها
  const productDiscount = itemsOriginalPrice - itemsFinalPrice;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'PERCENT') {
      couponDiscount = (itemsFinalPrice * appliedCoupon.value) / 100;
    } else { // FIXED
      couponDiscount = appliedCoupon.value;
    }
  }

  const totalDiscount = productDiscount + couponDiscount;
  const finalPrice = itemsFinalPrice - couponDiscount;
  
  const isCartEmpty = cartItems.length === 0;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // --- تغییر اصلی: پاس دادن توکن به تابع ---
      applyCoupon(couponCode, authTokens);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  return (
    <main className="main-content">
      <div className="cart-page">
        <div className="cart-header">
          <h2>سبد خرید شما</h2>
          {!isCartEmpty && <span>({formatPrice(cartItems.length)} کالا)</span>}
        </div>
        
        {isCartEmpty ? (
          <div className="empty-cart-message">
            <p>سبد خرید شما در حال حاضر خالی است.</p>
            <Link to="/" className="back-to-shop-btn">بازگشت به فروشگاه</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-container">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div
                    key={item.cartId}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="cart-item-card"
                  >
                    <Link to={`/product/${item.id}`}>
                        <img src={item.image.replace('12.7.0.0.1', '127.0.0.1')} alt={item.name} className="cart-item-image" />
                    </Link>
                    <div className="cart-item-details">
                      <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                      <p className="cart-item-price">{formatPrice(item.price)} تومان</p>
                      <div className="cart-item-actions">
                        <div className="quantity-selector-cart">
                          <button onClick={() => increaseQuantity(item.cartId)} disabled={item.quantity >= item.stock}>+</button>
                          <span>{formatPrice(item.quantity)}</span>
                          <button onClick={() => decreaseQuantity(item.cartId)}>-</button>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="remove-button">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="cart-summary-box">
              <div className="summary-row">
                <span>قیمت کالاها</span>
                <span>{formatPrice(itemsOriginalPrice)} تومان</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="summary-row discount">
                  <span>سود شما از خرید</span>
                  <span>- {formatPrice(totalDiscount)} تومان</span>
                </div>
              )}

              <div className="coupon-section">
                {!appliedCoupon ? (
                  <Input.Group compact>
                    <Input 
                      style={{ width: 'calc(100% - 100px)' }} 
                      placeholder="کد تخفیف"
                      onChange={(e) => setCouponCode(e.target.value)}
                      value={couponCode}
                    />
                    <Button type="primary" onClick={handleApplyCoupon}>اعمال</Button>
                  </Input.Group>
                ) : (
                  <div className="applied-coupon">
                    <span className="applied-coupon-text">✓ کد "{appliedCoupon.code}" اعمال شد.</span>
                    <button onClick={removeCoupon} className="remove-coupon-btn">
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
              
              <hr />
              <div className="summary-row total">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(finalPrice)} تومان</span>
              </div>
              <Link to="/checkout" className="checkout-button-link">
                <button className="checkout-button">ادامه فرآیند خرید</button>
              </Link>
            </div>
          </div>
        )}
      </div>
      {!isCartEmpty && <CartRecommendations />}
    </main>
  );
};

export default CartPage;