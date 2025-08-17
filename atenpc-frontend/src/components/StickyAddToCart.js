// src/components/StickyAddToCart.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import './StickyAddToCart.css';

const StickyAddToCart = ({ product, isVisible }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="sticky-fab-container"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="sticky-price-tag">
            {product.is_special_offer && (
              <span className="sticky-original-price">{formatPrice(product.price)}</span>
            )}
            <span className="sticky-final-price">{formatPrice(product.final_price)} تومان</span>
          </div>
          <button onClick={handleAddToCart} className="sticky-fab-button">
            <CartIcon />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAddToCart;