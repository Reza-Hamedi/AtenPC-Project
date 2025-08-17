// src/components/FeaturedBrands.js
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import api from '../api';
import './FeaturedBrands.css';

const FeaturedBrands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands/');
        if (response.data && response.data.results) {
          setBrands(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching featured brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 8000,
    autoplaySpeed: 0,
    cssEase: "linear",
    rtl: true,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } }
    ]
  };

  if (brands.length === 0) {
    return null;
  }
  
  return (
    <section className="featured-brands-section">
      <div className="brands-container">
        <h3 className="section-title">برندهای معتبر</h3>
        <Slider {...settings}>
          {brands.map(brand => (
            <div key={brand.id} className="brand-slide">
              <div className="brand-logo-container">
                {brand.logo ? (
                  <img 
                    src={brand.logo.replace('127.0.0.1', '127.0.0.1')} 
                    alt={brand.name} 
                    className="brand-logo" 
                  />
                ) : (
                  <span className="brand-name">{brand.name}</span>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedBrands;