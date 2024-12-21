import React, { useState } from 'react';
import axios from 'axios';
import styles from './SignupPage.module.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호와 비밀번호 확인 일치 여부 확인
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8888/api/auth/signup', {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: '', // Optional 필드 (주소는 비워둠)
                password: formData.password,
            });

            setSuccessMessage('회원가입이 완료되었습니다!');
            setError('');
            console.log('Signup successful:', response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : '서버 오류');
            setSuccessMessage('');
            console.error('Signup error:', err);
        }
    };

    return (
        <div className={styles.container}>
            <img
                className={styles.logo}
                src="/assets/image/plab_manager_logo.png"
                alt="plab manager"
            />
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <p className={styles.signupPageText}>이름</p>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <p className={styles.signupPageText}>이메일</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <p className={styles.signupPageText}>비밀번호</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <p className={styles.signupPageText}>비밀번호 확인</p>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <p className={styles.signupPageText}>전화번호</p>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button}>
                    회원가입
                </button>
            </form>

            {error && <p className={styles.error}>{error}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}

            <div>
                <a href="/login" className={styles.loginButton}>
                    이미 회원이신가요? 로그인하러가기
                </a>
            </div>

            <div className={styles.links}>
                <a href="/find-email" className={styles.links}>이메일 찾기</a> |
                <a href="/reset-password" className={styles.links}>비밀번호 재설정</a> |
                <a href="/apply-manager" className={styles.links}>매니저 지원하기</a>
            </div>
        </div>
    );
};

export default SignupPage;
