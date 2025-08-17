// src/components/AddAddressModal.js
import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';
import api from '../api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import './AddAddressModal.css';

const { Option } = Select;

const AddAddressModal = ({ onClose, onSuccess, initialData }) => {
  const { authTokens } = useContext(AuthContext);
  const [form] = Form.useForm();
  
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    // مقداردهی اولیه فرم در حالت ویرایش
    if (initialData) {
      form.setFieldsValue(initialData);
    }
    
    const fetchProvinces = async () => {
      try {
        const response = await api.get('/provinces/');
        setProvinces(response.data.results || response.data);
      } catch (error) {
          console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, [initialData, form]);
  
  const handleProvinceChange = async (provinceId) => {
    form.setFieldsValue({ city: null });
    setLoadingCities(true);
    try {
        const response = await api.get(`/cities/?province_id=${provinceId}`);
        setCities(response.data.results || response.data);
    } catch (error) {
        console.error("Error fetching cities:", error);
    } finally {
        setLoadingCities(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (initialData) {
        // --- منطق ویرایش آدرس ---
        await api.put(`/addresses/${initialData.id}/`, values, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        toast.success("آدرس با موفقیت ویرایش شد.");
      } else {
        // --- منطق ساخت آدرس جدید ---
        await api.post('/addresses/', values, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        toast.success("آدرس جدید با موفقیت اضافه شد.");
      }
      onSuccess(); // رفرش کردن لیست آدرس‌ها
      onClose();   // بستن مودال
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat().join('\n');
        toast.error(errorMessages);
      } else {
        toast.error("خطا در ذخیره آدرس.");
      }
    }
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-address-modal" onClick={onClose}>×</button>
        <h2>{initialData ? "ویرایش آدرس" : "افزودن آدرس جدید"}</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="full_name" label="نام کامل گیرنده" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="phone_number" label="شماره تماس" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="province" label="استان" rules={[{ required: true }]}>
            <Select showSearch placeholder="استان" onChange={handleProvinceChange}>
              {provinces.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="city" label="شهر" rules={[{ required: true }]}>
            <Select showSearch placeholder="شهر" disabled={!cities.length} loading={loadingCities}>
              {cities.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="address_line_1" label="آدرس کامل" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="postal_code" label="کد پستی" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="is_default" label="تنظیم به عنوان آدرس پیش‌فرض" valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" htmlType="submit" className="submit-auth-button">ذخیره آدرس</Button>
        </Form>
      </div>
    </div>
  );
};
export default AddAddressModal;