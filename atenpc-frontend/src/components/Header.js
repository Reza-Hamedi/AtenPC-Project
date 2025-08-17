// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import { ReactComponent as DiscountIcon } from '../assets/icons/discount.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import './Header.css';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logoutUser } = useContext(AuthContext);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeDiscount, setActiveDiscount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, discountRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/discounts/active/')
        ]);
        setCategories(catRes.data.results || catRes.data);
        setActiveDiscount(discountRes.data);
      } catch (error) {
        // console.error("Error fetching header data:", error);
      }
    };
    fetchData();
  }, []);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="header-container">
        <div className="app-header">
          <div className="header-main">
            <div className="header-main-right">
              <div className="mobile-actions">
                <button onClick={() => setIsMobileMenuOpen(true)} className="hamburger-menu"><MenuIcon /></button>
              </div>
              <Link to="/" className="logo-link"><h1 className="logo-aten">ATENPC</h1></Link>
            </div>
            <div className="header-main-center">
              <SearchBar />
            </div>
            <div className="header-main-left">
              <div className="desktop-auth">
                {user ? (
                  <div className="user-menu">
                    <Link to="/dashboard" className="welcome-link"><UserIcon /> {user.username}</Link>
                    <button onClick={logoutUser} className="logout-button">خروج</button>
                  </div>
                ) : (
                  <Link to="/login" className="auth-link-button"><UserIcon/> ورود | ثبت‌نام</Link>
                )}
              </div>
              <Link to="/cart" className="cart-icon-link">
                <CartIcon />
                {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
              </Link>
              <div className="mobile-actions">
                <button onClick={() => setIsSearchOpen(true)} className="mobile-search-trigger"><SearchIcon /></button>
              </div>
            </div>
          </div>
          <div className="header-bottom">
            <div 
              className="category-menu-container" 
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="category-menu-trigger">
                <MenuIcon />
                <span>دسته‌بندی کالاها</span>
              </button>
              <MegaMenu 
                isOpen={isMegaMenuOpen} 
                categories={categories} 
              />
            </div>
            <div className="header-extra-nav">
              <div className="services-dropdown">
                <button>خدمات ما ▾</button>
                <div className="dropdown-content">
                  <Link to="/dashboard/orders">رهگیری سفارش</Link>
                  <Link to="/page/how-to-buy">راهنمای خرید</Link>
                  <Link to="/page/about-us">درباره ما</Link>
                  <Link to="/page/contact-us">تماس با ما</Link>
                </div>
              </div>
              {activeDiscount && (
                <Link to="/special-offers" className="discount-shortcut-btn">
                  <DiscountIcon />
                  <span>تخفیف‌ها</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        categories={categories} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;