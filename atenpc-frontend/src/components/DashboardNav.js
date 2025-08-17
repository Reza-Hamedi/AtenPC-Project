// src/components/DashboardNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardNav.css';

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav">
      <ul>
        <li><NavLink to="/dashboard" end>پیشخوان</NavLink></li>
        <li><NavLink to="/dashboard/orders">سفارش‌های من</NavLink></li>
        <li><NavLink to="/dashboard/addresses">آدرس‌های من</NavLink></li>
        <li><NavLink to="/dashboard/profile">اطلاعات حساب</NavLink></li>
      </ul>
    </nav>
  );
};

export default DashboardNav;