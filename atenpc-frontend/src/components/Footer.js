// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Footer.css';

// ایمپورت‌های SVG لازم
import { ReactComponent as DeliveryIcon } from '../assets/icons/delivery.svg';
import { ReactComponent as IranIcon } from '../assets/icons/iran.svg';
import { ReactComponent as ReturnIcon } from '../assets/icons/return.svg';
import { ReactComponent as VerifyIcon } from '../assets/icons/verify.svg';

const Footer = () => {
  const [footerColumns, setFooterColumns] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [trustSeals, setTrustSeals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [columnsRes, socialRes, sealsRes] = await Promise.all([
          api.get('/footer-columns/'),
          api.get('/social-media/'),
          api.get('/trust-seals/')
        ]);
        
        setFooterColumns(columnsRes.data.results || columnsRes.data || []);
        setSocialLinks(socialRes.data.results || socialRes.data || []);
        setTrustSeals(sealsRes.data.results || sealsRes.data || []);

      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    fetchData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="jump-to-top" onClick={scrollToTop}>
        <span>بازگشت به بالا</span>
        <span className="jump-to-top-icon">▲</span>
      </div>
      <div className="footer-container">
        <div className="footer-top-info">
          <div className="info-item">
            <DeliveryIcon className="info-item-icon" />
            <p>ارسال سریع کالا</p>
          </div>
          <div className="info-item">
            <IranIcon className="info-item-icon" />
            <p>ارسال به سراسر کشور</p>
          </div>
          <div className="info-item">
            <ReturnIcon className="info-item-icon" />
            <p>ضمانت بازگشت وجه</p>
          </div>
          <div className="info-item">
            <VerifyIcon className="info-item-icon" />
            <p>ضمانت اصالت کالا</p>
          </div>
        </div>
        
        <div className="footer-main-content">
          {footerColumns.map(column => (
            <div key={column.title} className="footer-column">
              <h4>{column.title}</h4>
              <ul>
                {column.links && column.links.map(link => (
                  <li key={link.slug}>
                    <Link to={`/page/${link.slug}`}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-column">
            <h4>همراه ما باشید!</h4>
            <div className="social-icons">
              {socialLinks.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                  <div dangerouslySetInnerHTML={{ __html: link.icon_svg }} />
                </a>
              ))}
            </div>
            <h4>با اطمینان خرید کنید</h4>
            <div className="trust-seals">
              {trustSeals.map(seal => (
                <a key={seal.name} href={seal.url} target="_blank" rel="noopener noreferrer">
                  <img src={seal.image} alt={seal.name} className="seal-image" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 - تمامی حقوق این وب‌سایت متعلق به AtenPC می‌باشد.</p>
      </div>
    </footer>
  );
};

export default Footer;