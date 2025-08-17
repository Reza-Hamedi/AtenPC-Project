// src/pages/LoginPage.js
import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPage.css';

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const onFinish = async (values) => {
    const token = recaptchaRef.current.getValue();
    if (!token) {
        toast.error("لطفاً تأیید کنید که ربات نیستید.");
        return;
    }
    const success = await loginUser(values.username, values.password);
    if (success) {
      navigate('/');
    } else {
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="auth-page-overlay">
      <div className="auth-page-content">
        <Link to="/" className="close-auth-page">×</Link>
        <h2>ورود به حساب کاربری</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="نام کاربری" rules={[{ required: true, message: 'لطفاً نام کاربری خود را وارد کنید' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="رمز عبور" rules={[{ required: true, message: 'لطفاً رمز عبور خود را وارد کنید' }]}>
            <Input.Password />
          </Form.Item>          
          <Form.Item className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              hl="fa"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="submit-auth-button">
            ورود
          </Button>
        </Form>
        <div className="auth-page-footer">
          <p>حساب کاربری ندارید؟ <Link to="/register">ایجاد حساب</Link></p>
          <Link to="/forgot-password" className="forgot-password-link">رمز عبور خود را فراموش کرده‌اید؟</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;