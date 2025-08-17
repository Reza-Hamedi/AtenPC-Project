// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- ایمپورت اصلی axios برای auth
import api from '../api'; // <-- ایمپورت api برای بقیه درخواست‌ها
import { toast } from 'react-toastify'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();
  const authBaseUrl = process.env.REACT_APP_AUTH_BASE_URL || 'http://127.0.0.1:8000/auth';

  const loginUser = async (username, password) => {
    try {
      // Step 1: Get the tokens
      const response = await axios.post(`${authBaseUrl}/jwt/create/`, {
        username,
        password,
      });
      const data = response.data;
      setAuthTokens(data);
      localStorage.setItem('authTokens', JSON.stringify(data));

      // Step 2: Use the new token to get user details from our custom API
      const userResponse = await api.get('/profile/me/', {
          headers: {
              'Authorization': `Bearer ${data.access}`
          }
      });
      setUser(userResponse.data);

      navigate('/');
      toast.success("شما با موفقیت وارد شدید.");
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('نام کاربری یا رمز عبور اشتباه است.'); 
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };
  
  const refreshUser = async () => {
    if (authTokens) {
        try {
            const userResponse = await api.get('/profile/me/', {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            setUser(userResponse.data);
        } catch (error) {
            logoutUser();
        }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
        if (authTokens) {
            try {
                const userResponse = await api.get('/profile/me/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setUser(userResponse.data);
            } catch (error) {
                logoutUser();
            }
        }
        setLoading(false);
    };
    fetchUserData();
  }, [authTokens]);

  const contextData = {
    user,
    authTokens, 
    loginUser,
    logoutUser,
    refreshUser, 
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children} 
    </AuthContext.Provider>
  );
};