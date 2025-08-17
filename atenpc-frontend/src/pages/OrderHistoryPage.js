// src/pages/OrderHistoryPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authTokens) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/orders/', {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        setOrders(response.data.results || response.data);
      } catch (error) {
        toast.error("خطا در دریافت تاریخچه سفارش‌ها.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authTokens]);

  const handleViewInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice/`, {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      });
      
      const newTab = window.open();
      newTab.document.write(response.data);
      newTab.document.close();

    } catch (error) {
      toast.error("خطا در نمایش فاکتور.");
    }
  };

  const expandedRowRender = (record) => {
    const itemColumns = [
      { title: 'نام کالا', dataIndex: ['product', 'name'], key: 'product_name' },
      { title: 'تعداد', dataIndex: 'quantity', key: 'quantity', render: (qty) => formatPrice(qty) },
      { title: 'قیمت واحد (تومان)', dataIndex: 'price', key: 'price', render: (price) => formatPrice(price) },
    ];
    return <Table columns={itemColumns} dataSource={record.items} pagination={false} rowKey="id" />;
  };

  const columns = [
    { title: 'شماره سفارش', dataIndex: 'id', key: 'id', render: (id) => `#${formatPrice(id)}` },
    { title: 'تاریخ ثبت', dataIndex: 'created_at', key: 'created_at', render: (date) => new Date(date).toLocaleDateString('fa-IR') },
    { title: 'مبلغ کل (تومان)', dataIndex: 'total_paid', key: 'total_paid', render: (price) => formatPrice(price) },
    { 
      title: 'وضعیت', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'geekblue';
        if (status === 'DELIVERED') color = 'green';
        if (status === 'CANCELLED') color = 'volcano';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Button 
          icon={<EyeOutlined />} 
          onClick={() => handleViewInvoice(record.id)}
        >
          مشاهده فاکتور
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>سفارش‌های من</h2>
      <div className="desktop-orders-table">
        <Table 
          dataSource={orders} 
          columns={columns} 
          loading={loading} 
          rowKey="id" 
          expandable={{ expandedRowRender }}
        />
      </div>
      <div className="mobile-orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card-mobile">
            <div className="order-card-header">
              <span>شماره سفارش: #{formatPrice(order.id)}</span>
              <Tag color="geekblue">{order.status}</Tag>
            </div>
            <div className="order-card-body">
              <p><strong>تاریخ ثبت:</strong> {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
              <p><strong>مبلغ کل:</strong> {formatPrice(order.total_paid)} تومان</p>
            </div>
            <div className="order-card-footer">
              <Button 
                icon={<EyeOutlined />} 
                onClick={() => handleViewInvoice(order.id)}
                block
              >
                مشاهده فاکتور
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;