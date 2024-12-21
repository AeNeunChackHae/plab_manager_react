import React from 'react';
import styles from '../button/Button.module.css';

const Button = ({ onClick, children, variant = 'primary', disabled = false }) => {
    const buttonClass = `${styles.button} ${styles[variant]}`;

    return (
        <button className={buttonClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;