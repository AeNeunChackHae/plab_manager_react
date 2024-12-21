import React, { useState } from "react";
import axios from "axios";

const SignupForm = () => {
    // 상태 관리
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 입력 필드 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 회원가입 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 비밀번호 확인 로직
        if (formData.password !== formData.confirmPassword) {
            setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            // 백엔드 API 요청
            const response = await axios.post("http://백엔드주소/api/signup", formData);
            console.log("회원가입 성공:", response.data);
            setSuccessMessage("회원가입이 완료되었습니다!");
            setError("");
        } catch (err) {
            console.error("회원가입 실패:", err.response.data);
            setError("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="전화번호"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>회원가입</button>
                {error && <p style={styles.error}>{error}</p>}
                {successMessage && <p style={styles.success}>{successMessage}</p>}
            </form>
            <div style={styles.links}>
                <a href="/find-email">이메일 찾기</a>
                <a href="/reset-password">비밀번호 재설정</a>
                <a href="/support-manager">매니저 지원하기</a>
            </div>
        </div>
    );
};

// 스타일링
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
    success: {
        color: "green",
        marginTop: "10px",
    },
    links: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
    },
};

export default SignupForm;
