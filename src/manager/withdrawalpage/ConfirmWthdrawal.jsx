import React from 'react';
import styles from './ConfirmWithdrawal.module.css';

const ConfirmWithdrawal = ({ reason }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>정말 탈퇴하시겠어요?</h1>
            </header>
            <main className={styles.content}>
                <p>선택한 탈퇴 사유: {reason}</p>
                <p>아래 버튼을 누르면 탈퇴가 완료됩니다.</p>
                <button className={styles.withdrawButton}>탈퇴하기</button>
            </main>
        </div>
    );
};

export default ConfirmWithdrawal;
