import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>블랙리스트 알림</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ConfirmationModal;
