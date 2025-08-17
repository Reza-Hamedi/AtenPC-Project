// src/components/LoadingSpinner.js
import React from 'react';
import Lottie from "lottie-react";
import loaderAnimation from '../assets/animations/loader.json';
import './LoadingSpinner.css'; 

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="lottie-animation">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>
    </div>
  );
};

export default LoadingSpinner;