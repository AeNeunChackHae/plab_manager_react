import React from 'react';
import styles from './MyReviews.module.css';

const MyReviews = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src="/assets/image/profile_pic.png" alt="User" className={styles.profilePic} />
                <div className={styles.userInfo}>
                    <h1>김정섭</h1>
                    <p>mcschady@nate.com</p>
                    <p>010-1234-1234</p>
                </div>
            </header>
            <main className={styles.mainContent}>
                <div className={styles.messageCard}>
                    <div>
                        <p>최근 매치 리뷰</p>
                        <p>아직 받은 리뷰가 없어요</p>
                    </div>
                </div>
                <div className={styles.messageCard}>
                    <span role="img" aria-label="satisfied"><img className={styles.img} src="/assets/image/smile.png" alt="smile" /></span>
                    <div>
                        <p>칭찬해요</p>
                        <p>아직 받은 리뷰가 없어요</p>
                    </div>
                </div>
                <div className={styles.messageCard}>
                    <span role="img" aria-label="sad"><img className={styles.img} src="/assets/image/unhappy.png" alt="unhappy" /></span>
                    <div>
                        <p>아쉬워요</p>
                        <p>아직 받은 리뷰가 없어요</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyReviews;
