// src/components/SearchModal.js
import React from 'react';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-50%", opacity: 0 },
    visible: { y: "0%", opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-modal-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="search-modal-content"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-button" onClick={onClose}>×</button>
            <SearchBar onSearch={onClose} isModal={true} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;