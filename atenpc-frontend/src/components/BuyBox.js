// src/components/BuyBox.js
import React, { useState, useContext, useEffect } from 'react';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';
import './BuyBox.css';

const BuyBox = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [shippingMethods, setShippingMethods] = useState([]);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await api.get('/shipping-methods/');
        setShippingMethods(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      }
    };
    fetchShippingMethods();
  }, []);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    } else if (newQuantity > product.stock) {
      toast.error(`حداکثر ${formatPrice(product.stock)} عدد از این کالا در انبار موجود است.`);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="buy-box-container">
      {product.is_special_offer && (
        <div className="discount-badge-detail">{formatPrice(product.discount_percentage)}% تخفیف</div>
      )}
      <div className="price-section">
        <span className="final-price">{formatPrice(product.final_price)}</span>
        <span className="currency">تومان</span>
        {product.is_special_offer && (
          <span className="original-price">{formatPrice(product.price)}</span>
        )}
      </div>
      <div className="stock-status">
        {product.stock > 0 ? (
          <>
            <span>موجود در انبار</span>
            {product.stock <= 5 && <span className="stock-count"> (فقط {formatPrice(product.stock)} عدد باقی مانده)</span>}
          </>
        ) : (
          <span className="out-of-stock">ناموجود</span>
        )}
      </div>
      <div className="add-to-cart-controls">
        <div className="quantity-selector">
          <button onClick={() => handleQuantityChange(1)} disabled={product.stock === 0}>+</button>
          <span>{formatPrice(quantity)}</span>
          <button onClick={() => handleQuantityChange(-1)} disabled={product.stock === 0}>-</button>
        </div>
        <button onClick={handleAddToCart} className="add-to-cart-btn" disabled={product.stock === 0}>
          افزودن به سبد
        </button>
      </div>
      
      <div className="shipping-info-box">
        <h4>روش‌های ارسال</h4>
        <div className="shipping-methods-list">
            {shippingMethods.map(method => (
                <img 
                    key={method.id} 
                    src={method.logo} 
                    alt={method.name} 
                    className="shipping-method-icon" 
                    title={method.name}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BuyBox;