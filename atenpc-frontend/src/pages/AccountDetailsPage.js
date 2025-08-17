// src/pages/AccountDetailsPage.js
import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Card, Radio, InputNumber, Select } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AccountDetailsPage.css';

const { Option } = Select;

const AccountDetailsPage = () => {
  const { user, authTokens, refreshUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        national_id: user.national_id,
        phone_number: user.phone_number,
        landline_phone: user.landline_phone,
        gender: user.gender,
        interests: user.interests,
      });
      if (user.birth_date) {
        const dateParts = user.birth_date.split('-');
        setYear(parseInt(dateParts[0]));
        setMonth(parseInt(dateParts[1]));
        setDay(parseInt(dateParts[2]));
      }
    }
  }, [user, form]);

  const onFinishDetails = async (values) => {
    const birth_date = year && month && day
      ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      : null;
      
    const payload = {
        ...user,
        ...values,
        birth_date,
    };
    
    try {
      await api.patch('/profile/me/', payload, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      toast.success("اطلاعات شما با موفقیت بروزرسانی شد.");
      refreshUser();
    } catch (error) {
      toast.error("خطا در بروزرسانی اطلاعات.");
    }
  };

  const months = [
    { value: 1, name: 'فروردین' }, { value: 2, name: 'اردیبهشت' }, { value: 3, name: 'خرداد' },
    { value: 4, name: 'تیر' }, { value: 5, name: 'مرداد' }, { value: 6, name: 'شهریور' },
    { value: 7, name: 'مهر' }, { value: 8, name: 'آبان' }, { value: 9, name: 'آذر' },
    { value: 10, name: 'دی' }, { value: 11, name: 'بهمن' }, { value: 12, name: 'اسفند' },
  ];

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>اطلاعات حساب</h2>
      <Card title="ویرایش اطلاعات کاربری">
        <Form form={form} layout="vertical" onFinish={onFinishDetails}>
          <Form.Item name="first_name" label="نام"><Input /></Form.Item>
          <Form.Item name="last_name" label="نام خانوادگی"><Input /></Form.Item>
          <Form.Item name="email" label="ایمیل"><Input /></Form.Item>
          <Form.Item name="national_id" label="کد ملی (غیرقابل ویرایش)"><Input disabled /></Form.Item>
          <Form.Item name="phone_number" label="شماره همراه"><Input /></Form.Item>
          <Form.Item name="landline_phone" label="تلفن ثابت"><Input /></Form.Item>
          <Form.Item label="تاریخ تولد">
            <div className="birthdate-input-group">
              <InputNumber min={1} max={31} placeholder="روز" value={day} onChange={setDay} />
              <Select placeholder="ماه" value={month} onChange={setMonth}>
                {months.map(m => <Option key={m.value} value={m.value}>{m.name}</Option>)}
              </Select>
              <InputNumber min={1300} max={1403} placeholder="سال" value={year} onChange={setYear} />
            </div>
          </Form.Item>
          <Form.Item name="gender" label="جنسیت"><Radio.Group><Radio value="MALE">مرد</Radio><Radio value="FEMALE">زن</Radio></Radio.Group></Form.Item>
          <Form.Item name="interests" label="علاقه‌مندی‌ها"><Input.TextArea rows={3} /></Form.Item>        
          <Form.Item>
            <Button type="primary" htmlType="submit">ذخیره تغییرات</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AccountDetailsPage;