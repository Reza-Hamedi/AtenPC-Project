// src/pages/ShowcasePage.js
import React from 'react';
import './ShowcasePage.css';

const ShowcasePage = () => {
  return (
    <div className="showcase-container">
      <h1>شناسنامه پروژه AtenPC</h1>
      <p>توسعه دهنده پروژه **رضا حامدی**</p>
      
      <div className="tech-stack">
        <h2>پشته فناوری (Tech Stack)</h2>
        <ul className="tech-list">
          <li><strong>Frontend:</strong> React.js</li>
          <li><strong>Backend:</strong> Django & Django Rest Framework</li>
          <li><strong>Database:</strong> PostgreSQL / SQLite</li>
          <li><strong>UI Library:</strong> Ant Design</li>
          <li><strong>Animation:</strong> Framer Motion</li>
          <li><strong>Authentication:</strong> JWT (JSON Web Tokens) with Djoser</li>
          <li><strong>Routing:</strong> React Router</li>
          <li><strong>API Communication:</strong> Axios</li>
          <li><strong>Security:</strong> Google reCAPTCHA v2</li>
          <li><strong>Content Management:</strong> CKEditor</li>
        </ul>
      </div>

      <div className="showcase-links">
        <a href="[لینک گیت‌هاب شما]" target="_blank" rel="noopener noreferrer">پروفایل گیت‌هاب</a>
        <a href="[لینک لینکدین شما]" target="_blank" rel="noopener noreferrer">پروفایل لینکدین</a>
      </div>
    </div>
  );
};

export default ShowcasePage;