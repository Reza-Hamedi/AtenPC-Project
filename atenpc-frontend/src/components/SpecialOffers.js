// src/components/SpecialOffers.js
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import api from '../api';
import ProductCard from './ProductCard';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import amazingsLogo from '../assets/icons/Amazings.svg';
import './SpecialOffers.css';

const SpecialOffers = ({ onQuickView }) => { // <-- دریافت prop جدید
  const [products, setProducts] = useState([]);
  const [discountEvent, setDiscountEvent] = useState(null);

  useEffect(() => {
    const fetchDiscountEvent = async () => {
      try {
        const response = await api.get('/discounts/active/');
        if (response.data && response.data.name) {
          setDiscountEvent(response.data);
        }
      } catch (error) {
        console.error("Error fetching discount event:", error);
      }
    };
    
    const fetchOffers = async () => {
      try {
        const response = await api.get('/products/special-offers/');
        if (response.data && response.data.results) {
          setProducts(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching special offers:", error);
      }
    };

    fetchDiscountEvent();
    fetchOffers();
  }, []);

  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1,
    rtl: true,
    arrows: true,
    responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 4 } },
        { breakpoint: 1200, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
    ]
  };

  if (!discountEvent || products.length === 0) {
    return null;
  }

  const sectionStyle = discountEvent?.background_color
    ? { background: discountEvent.background_color }
    : {};

  const countdownRenderer = ({ days, hours, minutes, seconds }) => (
    <div className="intro-slide-timer">
        <div className="timer-box">
            <span>{String(seconds).padStart(2, '0')}</span>
            <span className="timer-label">ثانیه</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-box">
            <span>{String(minutes).padStart(2, '0')}</span>
            <span className="timer-label">دقیقه</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-box">
            <span>{String(hours).padStart(2, '0')}</span>
            <span className="timer-label">ساعت</span>
        </div>
        {days > 0 && (
            <>
                <span className="timer-separator">:</span>
                <div className="timer-box">
                    <span>{String(days)}</span>
                    <span className="timer-label">روز</span>
                </div>
            </>
        )}
    </div>
  );

  return (
    <section className="special-offers-section" style={sectionStyle}>
      <div className="special-offers-container">
        <div className="special-offers-layout">
          <div className="intro-card-container">
            <Link to="/special-offers" className="intro-slide-link">
              <div className="intro-slide-content">
                <h3 className="intro-slide-title">{discountEvent.name}</h3>
                <img 
                  src={amazingsLogo}
                  alt={discountEvent.name} 
                  className="intro-slide-image" 
                />
                <Countdown date={discountEvent.end_date} renderer={countdownRenderer} />
                <span className="see-all-text">مشاهده همه ›</span>
              </div>
            </Link>
          </div>
          <div className="offers-slider-container">
            <Slider {...settings}>
              {products.map(product => (
                <div key={product.id} className="offer-slide">
                  {/* --- پاس دادن prop به کارت محصول --- */}
                  <ProductCard product={product} onQuickView={onQuickView} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;