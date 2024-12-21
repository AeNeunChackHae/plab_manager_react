import React from 'react';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>비밀번호 변경</h1>
            <form className={styles.form}>
                <label className={styles.label}>현재 비밀번호</label>
                <input type="password" className={styles.input} placeholder="현재 비밀번호를 입력하세요" />

                <label className={styles.label}>변경할 비밀번호</label>
                <input type="password" className={styles.input} placeholder="새 비밀번호를 입력하세요" />

                <label className={styles.label}>변경할 비밀번호 확인</label>
                <input type="password" className={styles.input} placeholder="새 비밀번호를 다시 입력하세요" />

                <button type="submit" className={styles.button}>비밀번호 변경하기</button>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
