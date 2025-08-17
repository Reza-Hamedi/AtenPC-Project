// src/pages/StaticPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LoadingSpinner from '../components/LoadingSpinner';
import './StaticPage.css';

// --- این بخش برای حل مشکل آیکون مارکر در Leaflet ضروری است ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// --- پایان بخش حل مشکل ---

const StaticPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/pages/${slug}/`);
        const contentWithFullImageUrls = response.data.content.replace(/src="\/media\//g, 'src="http://127.0.0.1:8000/media/');
        setPage({ ...response.data, content: contentWithFullImageUrls });
      } catch (error) {
        console.error("Error fetching page:", error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!page) {
    return <div className="static-page-container"><p>صفحه‌ای یافت نشد.</p></div>;
  }

  const hasLocation = page.latitude && page.longitude;

  return (
    <main className="main-content">
      <div className="static-page-container">
        <h1 className="static-page-title">{page.title}</h1>
        <div 
          className="static-page-content"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />

        {/* --- بخش جدید برای نمایش نقشه --- */}
        {hasLocation && (
          <div className="map-container">
            <h3>موقعیت ما روی نقشه</h3>
            <MapContainer center={[page.latitude, page.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '400px', width: '100%', zIndex: 0 }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[page.latitude, page.longitude]}>
                <Popup>
                  AtenPC
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </main>
  );
};

export default StaticPage;