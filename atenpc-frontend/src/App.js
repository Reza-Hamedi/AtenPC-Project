// src/App.js
import React, { useEffect } from 'react';
import ShowcasePage from './pages/ShowcasePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RouteChangeTracker from './utils/RouteChangeTracker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './utils/ScrollToTop';

// کامپوننت‌ها و صفحات
import Header from './components/Header';
import Footer from './components/Footer';
import TawkToChat from './components/TawkToChat';
import ErrorBoundary from './components/ErrorBoundary';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './utils/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import StaticPage from './pages/StaticPage';
import SpecialOffersPage from './pages/SpecialOffersPage';
import DashboardPage from './pages/DashboardPage';
import AddressPage from './pages/AddressPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import DashboardHomePage from './pages/DashboardHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';

// Providerها
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// استایل‌ها
import './App.css';

function App() {

  useEffect(() => {
    console.log(
      "%cDeveloped by RezaHamedi with ❤️\n%cProject Showcase: /showcase",
      "font-weight: bold; font-size: 16px;",
      "font-size: 12px;"
    );
  }, []);

  return (
    <BrowserRouter>
    <RouteChangeTracker />
    <ScrollToTop />
      <div className="app-container">
        <AuthProvider>
          <CartProvider>
            <ToastContainer
              theme="colored"
              position="bottom-left" // <-- تغییر در اینجاست
              rtl={true}
              autoClose={5000}
              hideProgressBar={false}
            />
            <Header />
            <main className="site-content">
              <Routes>
                <Route path="/" element={<ProductListPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/page/:slug" element={<StaticPage />} />
                <Route path="/special-offers" element={<SpecialOffersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirmPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
                  <Route index element={<DashboardHomePage />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                  <Route path="addresses" element={<AddressPage />} />
                  <Route path="profile" element={<AccountDetailsPage />} />
                </Route>
                <Route path="/showcase" element={<ShowcasePage />} /> {/* <-- مسیر جدید */}
              </Routes>
            </main>
            <Footer />
            <ErrorBoundary>
              <TawkToChat />
            </ErrorBoundary>
          </CartProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;