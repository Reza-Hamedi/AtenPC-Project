// src/components/PromoBanners.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './PromoBanners.css';

const PromoBanners = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('/promo-banners/');
                setBanners(response.data.results || response.data);
            } catch (error) {
                console.error("Error fetching promo banners:", error);
            }
        };
        fetchBanners();
    }, []);

    if (banners.length === 0) return null;

    return (
        <div className="promo-banners-container">
            {banners.map(banner => (
                <a key={banner.title} href={banner.link} className="promo-banner-item">
                    <LazyLoadImage
                        src={banner.image}
                        alt={banner.title}
                        effect="blur"
                        className="promo-banner-image" // You might want to add a specific class for styling
                    />
                </a>
            ))}
        </div>
    );
};

export default PromoBanners;