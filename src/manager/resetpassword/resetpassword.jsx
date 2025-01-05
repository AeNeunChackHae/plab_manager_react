import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../signuppage/SignupPage.module.css"; // 동일한 스타일 재사용

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch("http://localhost:9090/auth/find-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage(
            <>
                임시 비밀번호가 이메일로 전송되었습니다. <br/>
                5초후 로그인 페이지로 이동합니다.
            </>
        );
        setError("");
        setIsModalOpen(true); // 모달 열기

        setTimeout(() => {
          setIsModalOpen(false); // 모달 닫기
          navigate("/"); // 로그인 페이지로 이동
        }, 5000);
      } else {
        setModalMessage("");
        setError(data.message || "정보가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 재설정 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="/assets/image/plab_manager_logo.png"
        alt="Plab Manager Logo"
      />
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
          <p className={styles.signupPageText}>전화번호</p>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
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
        <button onClick={handleResetPassword} className={styles.button}>
          비밀번호 재설정
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

      {/* 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}> 
            <h2 className={styles.modalHeader}>이메일 전송 완료</h2> 
            <p>{modalMessage}</p>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/")} className={styles.loginButton}>
        로그인 페이지로
      </button>
      <div className={styles.links}>
        <span onClick={() => handleNavigate("/find-email")}>이메일 찾기</span>{" "}
        |{" "}
        <span onClick={() => handleNavigate("/reset-password")}>
          비밀번호 재설정
        </span>{" "}
      </div>
    </div>
  );
};

export default ResetPassword;
