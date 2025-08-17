// src/components/HeroBanner.js
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import api from '../api';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HeroBanner.css';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get('/banners/');
        if (response.data && response.data.results) {
          setBanners(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    rtl: true,
    pauseOnHover: true,
    arrows: false, // <-- تغییر اصلی: دکمه‌های جهت‌نما حذف شدند
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="hero-banner-container">
      <div className="slider-wrapper">
        <Slider {...settings}>
          {banners.map(banner => (
            <div key={banner.id}>
              <a href={banner.link} target="_blank" rel="noopener noreferrer">
                <img 
                  src={banner.image.replace('12.7.0.0.1', '127.0.0.1')} 
                  alt={banner.title} 
                  className="banner-image"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroBanner;