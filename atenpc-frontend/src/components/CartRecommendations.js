// src/components/CartRecommendations.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import Slider from 'react-slick';
import MiniProductCard from './MiniProductCard';
import { CartContext } from '../context/CartContext';
import './RelatedProducts.css'; // از استایل اسلایدر کالاهای مشابه استفاده می‌کنیم

const CartRecommendations = () => {
    const { cartItems } = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (cartItems.length === 0) {
                setProducts([]);
                return;
            }
            try {
                const product_ids = cartItems.map(item => item.id);
                const response = await api.post('/cart-recommendations/', { product_ids });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching cart recommendations:", error);
            }
        };
        fetchRecommendations();
    }, [cartItems]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        rtl: false,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ]
    };

    if (products.length === 0) return null;

    return (
        <div className="related-products-section">
            <h3 className="related-title">شاید دلت بخواد این ها رو هم ببینی</h3>
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

export default CartRecommendations;