import React from 'react';
import styles from './Modal.css'; // 수정된 스타일 경로

const Modal = ({ isOpen, title, children, closeModal }) => {
    if (!isOpen) return null;

    const handleClose = () => closeModal(); // 인자를 제거하여 간소화

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div className={styles.modalContent}>
                    {children}
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={handleClose} aria-label="Confirm">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;