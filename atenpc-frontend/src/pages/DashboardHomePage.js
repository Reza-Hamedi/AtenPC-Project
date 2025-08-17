// src/pages/DashboardHomePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './DashboardHomePage.css';

// ایمپورت آیکون‌ها به صورت کامپوننت
import { ReactComponent as OrdersIcon } from '../assets/icons/orders.svg';
import { ReactComponent as AddressIcon } from '../assets/icons/address.svg';
import { ReactComponent as ProfileIcon } from '../assets/icons/profile.svg';

const DashboardHomePage = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null; // یا یک اسپینر لودینگ
    }

    return (
        <div className="dashboard-home">
            <h2>پیشخوان</h2>
            <p className="welcome-home">سلام {user.username}، به پنل کاربری خود خوش آمدید. از اینجا می‌توانید به بخش‌های مختلف حساب خود دسترسی داشته باشید.</p>
            <div className="dashboard-shortcuts">
                <Link to="/dashboard/orders" className="shortcut-card">
                    <OrdersIcon className="shortcut-icon" />
                    <span>سفارش‌های من</span>
                </Link>
                <Link to="/dashboard/addresses" className="shortcut-card">
                    <AddressIcon className="shortcut-icon" />
                    <span>آدرس‌های من</span>
                </Link>
                <Link to="/dashboard/profile" className="shortcut-card">
                    <ProfileIcon className="shortcut-icon" />
                    <span>اطلاعات حساب</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHomePage;