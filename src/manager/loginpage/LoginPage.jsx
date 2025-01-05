import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:9090/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, login_password: password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // 에러 메시지를 alert 창으로 표시
        alert(errorData.message || "이메일 또는 비밀번호가 잘못되었습니다.");
        return;
      }
  
      const result = await response.json();
      console.log("로그인 성공:", result);
  
      // 토큰과 유저 ID 저장
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.id);
  
      // 페이지 이동
      navigate("/schedule-list");
    } catch (err) {
      console.error("로그인 에러:", err);
      // 서버 오류 메시지를 alert 창으로 표시
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
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
            required
          />
        </div>
        <div>
          <p>비밀번호</p>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <button type="submit" className={styles.button}>
            로그인
          </button>
        </div>
      </form>
      <div>
        <button
          className={styles.signupButton}
          onClick={() => handleNavigate("/signup")}
        >
          아직 회원이 아니신가요? 회원가입하러가기
        </button>
      </div>
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

export default LoginPage;
