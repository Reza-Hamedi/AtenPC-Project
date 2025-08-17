// src/components/RecentlyViewed.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import Slider from 'react-slick';
import MiniProductCard from './MiniProductCard';
import './RelatedProducts.css';

const RecentlyViewed = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            setLoading(true);
            const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
            if (viewedIds.length === 0) {
                setLoading(false);
                setProducts([]);
                return;
            }

            try {
                const response = await api.post('/products/by_ids/', { product_ids: viewedIds });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching recently viewed products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentlyViewed();
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4 } },
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ]
    };

    if (loading || products.length === 0) {
        return null;
    }

    return (
        <div className="related-products-section">
            <h3 className="related-title">بازدیدهای اخیر شما</h3>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} className="related-product-slide">
                        <MiniProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RecentlyViewed;