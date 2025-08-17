// src/components/RelatedProducts.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import Slider from 'react-slick';
import MiniProductCard from './MiniProductCard';
import './RelatedProducts.css';

// کامپوننت‌های دکمه‌های سفارشی
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
    />
  );
}

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
    />
  );
}

const RelatedProducts = ({ productId }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const response = await api.get(`/products/${productId}/related/`);
                setProducts(response.data.results || response.data);
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };
        if (productId) {
            fetchRelated();
        }
    }, [productId]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        rtl: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4 } },
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ]
    };

    if (products.length === 0) return null;

    return (
        <div className="related-products-section">
            <h3 className="related-title">کالاهای مشابه</h3>
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

export default RelatedProducts;