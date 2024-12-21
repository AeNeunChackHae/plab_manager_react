import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const isSuccess = true;
        if (isSuccess) {
            navigate('/schedule-list');
        } else {
            alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/assets/image/plab_manager_logo.png" alt="Plab Manager Logo" />
            </div>
            <form onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                    <p>이메일</p>
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <p>비밀번호</p>
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit" className={styles.button}>로그인</button>
                </div>
            </form>
            <div>
                <a href="/signup" className={styles.signupButton}>
                    아직 회원이 아니신가요? 회원가입하러가기
                </a>
            </div>
            <div className={styles.links}>
                <a href="/find-email">이메일 찾기</a> |
                <a href="/reset-password">비밀번호 재설정</a> |
                <a href="/apply-manager">매니저 지원하기</a>
            </div>
        </div>
    );
};

export default LoginPage;
