import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import { config } from "../../config";


const SignupPage = () => {
  const api = config.aws.ec2_host_manager
  const [formData, setFormData] = useState({
    manager_name: '',
    email: '',
    login_password: '',
    login_password_confirm: '',
    phone_number: '',
  });

  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

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
    if (formData.login_password !== formData.login_password_confirm) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${api}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '회원가입 실패');
        return;
      }

      setError('');
      setIsModalOpen(true); // 회원가입 성공 시 모달 열기
    } catch (err) {
      setError('서버 오류');
      console.error('Signup error:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/'); // 로그인 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="/assets/image/plab_manager_logo.png"
        alt="Plab Manager Logo"
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <p className={styles.signupPageText}>이름</p>
          <input
            type="text"
            name="manager_name"
            value={formData.manager_name}
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
            name="login_password"
            value={formData.login_password}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <p className={styles.signupPageText}>비밀번호 확인</p>
          <input
            type="password"
            name="login_password_confirm"
            value={formData.login_password_confirm}
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

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>회원가입 완료</h3>
            <p>회원가입이 성공적으로 완료되었습니다!</p>
            <button onClick={closeModal} className={styles.modalButton}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 추가 링크 섹션 */}
      <div>
        <button onClick={() => navigate('/')} className={styles.loginButton}>
          이미 회원이신가요? 로그인하러가기
        </button>
      </div>
      <div className={styles.links}>
        <span onClick={() => navigate('/find-email')} className={styles.linkButton}>
          이메일 찾기
        </span>
        {" | "}
        <span onClick={() => navigate('/reset-password')} className={styles.linkButton}>
          비밀번호 재설정
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
