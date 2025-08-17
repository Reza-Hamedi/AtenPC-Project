// src/pages/AddressPage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Button, Card, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddAddressModal from '../components/AddAddressModal'; // ایمپورت کامپوننت مودال
import './AddressPage.css';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { authTokens } = useContext(AuthContext);

  const fetchAddresses = async () => {
    if (!authTokens) {
        setLoading(false);
        return;
    };
    setLoading(true);
    try {
      const response = await api.get('/addresses/', {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      setAddresses(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("خطا در دریافت آدرس‌ها.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [authTokens]);

  const showModal = (address = null) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  }

  const handleDelete = async (addressId) => {
    try {
      await api.delete(`/addresses/${addressId}/`, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      toast.success("آدرس با موفقیت حذف شد.");
      fetchAddresses(); // Refresh the list
    } catch (error) {
      toast.error("خطا در حذف آدرس.");
    }
  };

  return (
    <div className="address-page">
      <div className="address-page-header">
        <h2>آدرس‌های من</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          آدرس جدید
        </Button>
      </div>

      <div className="address-cards-container">
        {addresses.map(addr => (
          <Card 
            key={addr.id}
            className="address-card"
            title={addr.is_default ? "آدرس پیش‌فرض" : `آدرس ${addr.id}`}
            actions={[
              <EditOutlined key="edit" onClick={() => showModal(addr)} />,
              <Popconfirm
                title="حذف آدرس"
                description="آیا از حذف این آدرس مطمئن هستید؟"
                onConfirm={() => handleDelete(addr.id)}
                okText="بله"
                cancelText="خیر"
              >
                <DeleteOutlined key="delete" />
              </Popconfirm>,
            ]}
          >
            <p><strong>گیرنده:</strong> {addr.full_name}</p>
            <p><strong>شهر:</strong> {addr.city_name}</p>
            <p><strong>آدرس:</strong> {addr.address_line_1}</p>
            <p><strong>کد پستی:</strong> {addr.postal_code}</p>
            <p><strong>شماره تماس:</strong> {addr.phone_number}</p>
          </Card>
        ))}
      </div>
      
      {isModalVisible && (
        <AddAddressModal 
          onClose={handleModalClose} 
          onSuccess={fetchAddresses}
          initialData={editingAddress}
        />
      )}
    </div>
  );
};

export default AddressPage;