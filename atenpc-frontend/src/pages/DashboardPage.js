// src/pages/DashboardPage.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <main className="main-content">
      <div className="dashboard-layout">
        <DashboardNav />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;