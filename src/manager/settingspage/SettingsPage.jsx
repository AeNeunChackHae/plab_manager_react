import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.menuItem} onClick={() => navigate('/change-password')}>
                    비밀번호 변경
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/login')}>
                    로그아웃
                </div>
                <div className={styles.divider}></div>
                <div className={styles.menuItem} onClick={() => navigate('/privacy-policy')}>
                    개인정보처리방침
                </div>
                <div className={styles.divider}></div>
                <div className={styles.appInfo}>
                    <p>앱 버전 1.39.0</p>
                    <p>최신 버전 1.39.2</p>
                </div>
                <button className={styles.withdrawButton} onClick={() => navigate('/withdrawal')}>
                    탈퇴하기 &gt;
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
