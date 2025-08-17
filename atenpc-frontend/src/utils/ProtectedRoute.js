// src/utils/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, show the page they wanted to access
  return children;
};

export default ProtectedRoute;