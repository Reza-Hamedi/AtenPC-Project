// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => 
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    let success = true;
    if (product.max_quantity_per_user && quantity > product.max_quantity_per_user) {
        toast.error(`شما مجاز به خرید حداکثر ${formatPrice(product.max_quantity_per_user)} عدد از این کالا هستید.`);
        return false; // گزارش شکست
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (existingItem.max_quantity_per_user && newQuantity > existingItem.max_quantity_per_user) {
            toast.error(`شما مجاز به خرید حداکثر ${formatPrice(existingItem.max_quantity_per_user)} عدد از این کالا هستید.`);
            success = false;
            return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      const itemToAdd = {
        ...product,
        price: product.final_price, 
        original_price: product.price,
        quantity: quantity,
        cartId: Date.now(),
      };
      return [...prevItems, itemToAdd];
    });

    if (success) {
        toast.success(`"${product.name}" (${formatPrice(quantity)} عدد) به سبد خرید اضافه شد.`);
    }
    return success;
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const increaseQuantity = (cartId) => {
    let success = true;
    setCartItems(prevItems => prevItems.map(item => {
        if (item.cartId === cartId) {
            const newQuantity = item.quantity + 1;
            if (item.max_quantity_per_user && newQuantity > item.max_quantity_per_user) {
                toast.error(`شما مجاز به خرید حداکثر ${formatPrice(item.max_quantity_per_user)} عدد از این کالا هستید.`);
                success = false;
                return item;
            }
            if (newQuantity > item.stock) {
                toast.error(`موجودی این کالا در انبار ${formatPrice(item.stock)} عدد است.`);
                success = false;
                return item;
            }
            return { ...item, quantity: newQuantity };
        }
        return item;
    }));
    return success;
  };
  
  const decreaseQuantity = (cartId) => {
    setCartItems(prevItems => prevItems.map(item => 
      item.cartId === cartId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };
  
  const applyCoupon = async (code, authTokens) => {
    try {
      if (!authTokens) {
          toast.error("برای استفاده از کد تخفیف باید وارد حساب کاربری خود شوید.");
          return false;
      }
      
      const response = await api.post('/coupons/validate/', { code }, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      
      setAppliedCoupon(response.data);
      toast.success(`کد تخفیف "${response.data.code}" با موفقیت اعمال شد.`);
      return true;
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.response?.data?.error || "کد تخفیف نامعتبر است.");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("کد تخفیف حذف شد.");
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider> 
  );
};