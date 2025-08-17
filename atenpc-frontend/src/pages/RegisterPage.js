// src/pages/RegisterPage.js
import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Radio, Progress } from 'antd';
import api from '../api';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import ReCAPTCHA from "react-google-recaptcha";
import './AuthPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState({ score: 0 });
  const [usernameStatus, setUsernameStatus] = useState({ is_taken: false, suggestions: [] });
  const recaptchaRef = useRef();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result);
    } else {
      setPasswordStrength({ score: 0 });
    }
  };

  const passwordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0: return '#828282';
      case 1: return '#ef4056';
      case 2: return '#f9a825';
      case 3: return '#d9cc11ff';
      case 4: return '#52c41a';
      default: return '#828282';
    }
  };

  const fetchUsernameSuggestions = async () => {
    const firstName = form.getFieldValue('first_name');
    const lastName = form.getFieldValue('last_name');

    if (firstName && lastName) {
      try {
        const response = await api.get(`/check-username/?first_name=${firstName}&last_name=${lastName}`);
        setUsernameStatus({ is_taken: false, suggestions: response.data.suggestions });
      } catch (error) {
        console.error("Error fetching username suggestions:", error);
      }
    }
  };

  const onFinish = async (values) => {
    const token = recaptchaRef.current.getValue();
    if (!token) {
        toast.error("لطفاً تأیید کنید که ربات نیستید.");
        return;
    }
    const payload = { ...values, "g-recaptcha-response": token };
    
    try {
      await api.post('/register/', payload);
      toast.success('ثبت‌نام با موفقیت انجام شد! لطفاً وارد شوید.');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat().join('\n');
        toast.error(errorMessages);
      } else {
        toast.error('خطا در ثبت‌نام.');
      }
      recaptchaRef.current.reset();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation Failed:', errorInfo);
    toast.error('لطفاً تمام فیلدهای الزامی را به درستی پر کنید.');
  };

  return (
    <div className="auth-page-overlay">
      <div className="auth-page-content">
        <Link to="/" className="close-auth-page">×</Link>
        <h2>ایجاد حساب کاربری</h2>
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item name="first_name" label="نام (به فارسی)" rules={[{ required: true, message: 'لطفاً نام خود را وارد کنید' }]}><Input /></Form.Item>
          <Form.Item name="last_name" label="نام خانوادگی (به فارسی)" rules={[{ required: true, message: 'لطفاً نام خانوادگی خود را وارد کنید' }]}>
            <Input onBlur={fetchUsernameSuggestions} />
          </Form.Item>
          <Form.Item 
            name="username" 
            label="نام کاربری (به انگلیسی)" 
            rules={[
              { required: true, message: 'لطفاً نام کاربری خود را وارد کنید' },
              { 
                pattern: /^[a-zA-Z0-9_]{3,}$/, // <-- اشتباه تایپی در اینجا اصلاح شد
                message: 'نام کاربری باید حداقل ۳ کاراکتر و فقط شامل حروف انگلیسی، اعداد و _ باشد' 
              }
            ]}
          >
            <Input />
          </Form.Item>
          {usernameStatus.suggestions.length > 0 && (
            <div className="username-suggestions">
              <p>نام‌های کاربری پیشنهادی:</p>
              <div>
                {usernameStatus.suggestions.map(s => <Button size="small" key={s} onClick={() => form.setFieldsValue({ username: s })}>{s}</Button>)}
              </div>
            </div>
          )}
          <Form.Item name="email" label="ایمیل" rules={[{ required: true, type: 'email', message: 'لطفاً یک ایمیل معتبر وارد کنید' }]}><Input /></Form.Item>
          <Form.Item name="national_id" label="کد ملی" rules={[{ required: true, pattern: /^\d{10}$/, message: 'کد ملی باید ۱۰ رقم باشد' }]}><Input /></Form.Item>
          <Form.Item name="phone_number" label="شماره همراه" rules={[{ required: true, pattern: /^09\d{9}$/, message: 'شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود' }]}><Input /></Form.Item>
          <Form.Item name="gender" label="جنسیت" rules={[{ required: true, message: 'لطفاً جنسیت را انتخاب کنید' }]}>
            <Radio.Group><Radio value="MALE">مرد</Radio><Radio value="FEMALE">زن</Radio></Radio.Group>
          </Form.Item>
          <Form.Item name="password" label="رمز عبور" rules={[{ required: true, message: 'لطفاً رمز عبور را وارد کنید' }]}>
            <Input.Password onChange={handlePasswordChange} />
          </Form.Item>
          <div className="password-rules">
            <p>رمز عبور باید شامل موارد زیر باشد:</p>
            <ul>
              <li>حداقل ۸ کاراکتر</li>
              <li>ترکیبی از حروف و اعداد</li>
            </ul>
          </div>
          {passwordStrength.score > 0 && (
            <div className="password-strength-container">
              <Progress percent={(passwordStrength.score + 1) * 20} showInfo={false} strokeColor={passwordStrengthColor()} />
            </div>
          )}
          <Form.Item name="re_password" label="تکرار رمز عبور" dependencies={['password']} rules={[{ required: true, message: 'لطفاً تکرار رمز عبور را وارد کنید' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('رمزهای عبور یکسان نیستند!')); }, })]}><Input.Password /></Form.Item>
          <Form.Item name="terms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('پذیرفتن قوانین الزامی است')) }]}>
            <Checkbox>
              <Link to="/page/terms" target="_blank">قوانین و مقررات</Link> را می‌پذیرم.
            </Checkbox>
          </Form.Item>
          
          <Form.Item className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              hl="fa"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="submit-auth-button">ثبت‌نام</Button>
        </Form>
        <div className="auth-page-footer">
          <p>قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">ورود</Link></p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;