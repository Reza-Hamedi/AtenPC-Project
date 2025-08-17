// src/pages/ForgotPasswordPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AuthPage.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const authBaseUrl = process.env.REACT_APP_AUTH_BASE_URL || 'http://127.0.0.1:8000/auth';
    
    try {
      await axios.post(`${authBaseUrl}/users/reset_password/`, values);
      toast.success('ایمیل بازیابی رمز عبور با موفقیت ارسال شد. لطفاً ایمیل خود را چک کنید.');
      navigate('/login');
    } catch (error) {
      toast.error('خطا در ارسال ایمیل بازیابی.');
    }
  };

  return (
    <div className="auth-page-overlay">
      <div className="auth-page-content">
        <Link to="/" className="close-auth-page">×</Link>
        <h2>بازیابی رمز عبور</h2>
        <p className="form-description">لطفاً ایمیل حساب کاربری خود را وارد کنید تا لینک بازیابی برای شما ارسال شود.</p>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="email" 
            label="ایمیل" 
            rules={[
              { required: true, message: 'لطفاً ایمیل خود را وارد کنید' },
              { type: 'email', message: 'فرمت ایمیل نامعتبر است' }
            ]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="submit-auth-button">
            ارسال لینک بازیابی
          </Button>
        </Form>
        <div className="auth-page-footer">
          <Link to="/login">بازگشت به صفحه ورود</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;