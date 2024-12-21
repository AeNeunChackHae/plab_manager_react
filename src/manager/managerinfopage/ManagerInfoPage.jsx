import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ManagerInfoPage.module.css';

const ManagerInfoPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                {/* 사용자 정보 */}
                <div className={styles.infoSection}>
                    <h1 className={styles.infoText}>홍길동</h1>
                    <p className={styles.infoText}>example@example.com</p>
                    <div>
                        <div>
                            <p>이번달/누적 진행 경기</p>
                            <img src="/assets/image/football.png" alt="ball" />0/0경기
                        </div>
                    </div>
                    <div></div>
                    {/* 네비게이션 버튼들 */}
                    <div className={styles.navButtons}>
                        <div className={styles.navButtonContainer}>
                            <img src='/assets/image/calendar.png' alt="Calendar" className={styles.icon} />
                            <button onClick={() => navigate('/my-matches')} className={styles.navButton}>나의 매치</button>
                        </div>
                    </div>
                    <div>
                        <div className={styles.navButtonContainer}>
                            <img src='/assets/image/smile.png' alt="Review" className={styles.icon} />
                            <button onClick={() => navigate('/reviews')} className={styles.navButton}>매치 리뷰</button>
                        </div>
                    </div>
                    <div>
                        <div className={styles.navButtonContainer}>
                            <img src='/assets/image/setting.png' alt="Setting" className={styles.icon} />
                            <button onClick={() => navigate('/settings')} className={styles.navButton}>설정</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerInfoPage;
