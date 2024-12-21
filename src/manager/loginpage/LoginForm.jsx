import React, { useState } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'



export const LoginForm = () => {
    // 상태 관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 로그인 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // 백엔드 API 요청
            const response = await axios.post("http://백엔드주소/api/login", {
                email,
                password,
            });
            console.log("로그인 성공:", response.data);
            // 로그인 성공 시 리다이렉트 로직 추가
        } catch (err) {
            console.error("로그인 실패:", err.response.data);
            setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };
    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <p className="font">이메일</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <p className="font">비밀번호</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>로그인</button>
                {error && <p style={styles.error}>{error}</p>}
            </form>
            <div style={styles.links}>
                <a href="/find-email">이메일 찾기</a>
                <a href="/reset-password">비밀번호 재설정</a>
                <a href="/support-manager">매니저 지원하기</a>
            </div>
        </div>
    );
};

// 간단한 스타일링
const styles = {
    container: {
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "'Arial', sans-serif",
    },
    logo: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
    links: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
    },

};

export default LoginForm;