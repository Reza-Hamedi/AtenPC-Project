// src/pages/PasswordResetConfirmPage.js
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AuthPage.css';

const PasswordResetConfirmPage = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const onFinish = async (values) => {
    const authBaseUrl = process.env.REACT_APP_AUTH_BASE_URL || 'http://127.0.0.1:8000/auth';
    
    const payload = {
      uid,
      token,
      new_password: values.new_password,
      re_new_password: values.re_new_password,
    };

    try {
      await axios.post(`${authBaseUrl}/users/reset_password_confirm/`, payload);
      toast.success('رمز عبور شما با موفقیت تغییر کرد. لطفاً دوباره وارد شوید.');
      navigate('/login');
    } catch (error) {
      toast.error('لینک بازیابی نامعتبر یا منقضی شده است.');
    }
  };

  return (
    <div className="auth-page-overlay">
      <div className="auth-page-content">
        <Link to="/" className="close-auth-page">×</Link>
        <h2>تنظیم رمز عبور جدید</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="new_password" 
            label="رمز عبور جدید" 
            rules={[{ required: true, message: 'لطفاً رمز عبور جدید را وارد کنید' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item 
            name="re_new_password" 
            label="تکرار رمز عبور جدید"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'لطفاً تکرار رمز عبور را وارد کنید' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('رمزهای عبور یکسان نیستند!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="submit-auth-button">
            ذخیره رمز عبور جدید
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PasswordResetConfirmPage;