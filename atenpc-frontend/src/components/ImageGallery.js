// src/components/ImageGallery.js
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './ImageGallery.css';

const ImageGallery = ({ images, mainImage }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const allImages = [mainImage, ...images.map(img => img.image).filter(img => img !== mainImage)];

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);
  
  const showModal = () => {
    const mainImageIndex = allImages.findIndex(img => img === selectedImage);
    setModalImageIndex(mainImageIndex >= 0 ? mainImageIndex : 0);
    setIsModalVisible(true);
  };

  const handleModalNav = (direction) => {
    if (direction === 'next') {
      setModalImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    } else {
      setModalImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="image-gallery-container">
      <div className="gallery-thumbnails">
        {allImages.slice(0, 4).map((imgUrl, index) => (
          <div 
            key={index}
            className={`thumbnail-item ${selectedImage === imgUrl ? 'active' : ''}`}
            onClick={() => setSelectedImage(imgUrl)}
          >
            <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
        {allImages.length > 4 && (
          <div className="thumbnail-item view-all" onClick={showModal}>
            <span>+{allImages.length - 4}</span>
            <span>دیدن همه</span>
          </div>
        )}
      </div>
      <div className="gallery-main-image" onClick={showModal} style={{ cursor: 'zoom-in' }}>
        <img src={selectedImage} alt="Product" className="main-image-display" />
      </div>

      <Modal 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null} 
        width="85vw"
        centered
        destroyOnClose
        className="gallery-modal"
        zIndex={1050} // <-- تغییر اصلی و نهایی در اینجاست
      >
        <div className="modal-gallery-layout">
          <div className="modal-main-view">
            <button className="modal-nav-btn prev" onClick={() => handleModalNav('prev')}>›</button>
            <img src={allImages[modalImageIndex]} alt="Full view" />
            <button className="modal-nav-btn next" onClick={() => handleModalNav('next')}>‹</button>
          </div>
          <div className="modal-thumbnail-list">
            {allImages.map((img, index) => (
              <div 
                key={index} 
                className={`modal-thumbnail-item ${index === modalImageIndex ? 'active' : ''}`}
                onClick={() => setModalImageIndex(index)}
              >
                <img src={img} alt={`Gallery thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageGallery;