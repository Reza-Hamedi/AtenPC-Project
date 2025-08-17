// src/components/MegaMenu.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MegaMenu.css';

const MegaMenu = ({ isOpen, categories, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mega-menu-container">
      <div className="main-categories">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`main-category-item ${activeCategory && activeCategory.id === cat.id ? 'active' : ''}`}
            onMouseEnter={() => setActiveCategory(cat)}
          >
            <Link to={`/category/${cat.slug}`} onClick={onClose}>{cat.name}</Link>
          </div>
        ))}
      </div>
      <div className="sub-categories">
        {activeCategory ? (
          activeCategory.children.map(child => (
            <div key={child.id} className="submenu-column">
              <Link to={`/category/${child.slug}`} className="submenu-title" onClick={onClose}>{child.name}</Link>
              <ul>
                {child.children.map(grandchild => (
                  <li key={grandchild.id}>
                    <Link to={`/category/${grandchild.slug}`} onClick={onClose}>{grandchild.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="no-category-selected">
            <p>از منوی سمت راست یک دسته‌بندی را انتخاب کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;