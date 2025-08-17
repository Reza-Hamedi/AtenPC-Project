// src/components/MobileMenu.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileMenu.css';

const MobileMenu = ({ categories, isOpen, onClose }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="mobile-menu-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          ></motion.div>
          <motion.div
            className="mobile-menu-container"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mobile-menu-header">
              {user ? `خوش آمدید، ${user.username}` : <h3>منو</h3>}
              <button onClick={onClose} className="close-button">×</button>
            </div>

            <div className="mobile-menu-auth">
              {user ? (
                <div className="mobile-user-actions">
                  <Link to="/dashboard" className="mobile-auth-link" onClick={onClose}>داشبورد کاربری</Link>
                  <a className="mobile-auth-link logout" onClick={() => { logoutUser(); onClose(); }}>خروج از حساب</a>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="mobile-auth-link login" onClick={onClose}>ورود</Link>
                  <Link to="/register" className="mobile-auth-link register" onClick={onClose}>ثبت‌نام</Link>
                </div>
              )}
            </div>

            <div className="mobile-menu-separator"></div>

            <ul className="mobile-menu-list">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} onClick={onClose}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;