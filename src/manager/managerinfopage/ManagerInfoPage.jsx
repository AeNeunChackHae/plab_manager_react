import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerInfoPage.module.css";

const ManagerInfoPage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [managerInfo, setManagerInfo] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchManagerInfo = async () => {
      try {
        // 스토리지에서 id 값 가져오기
        const storedId = localStorage.getItem("userId");
        if (!storedId) {
          throw new Error("스토리지에 ID가 없습니다.");
        }

        const response = await fetch(
          "http://127.0.0.1:9090/auth/manager-info",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: storedId, // 스토리지에서 가져온 ID를 전달
            }),
          }
        );
        console.log("storedId:", storedId);

        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();
        setManagerInfo({
          name: data.manager_name,
          email: data.email,
          phonenumber: data.phone_number,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchManagerInfo();
  }, []);

  // 로딩 또는 에러 상태 처리
  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>에러: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {/* 사용자 정보 */}
        <div className={styles.infoSection}>
          <h1 className={styles.infoText}>{managerInfo.name}</h1>
          <p className={styles.infoText}>{managerInfo.email}</p>
          <p className={styles.infoText}>{managerInfo.phonenumber}</p>

          {/* 네비게이션 버튼 */}
          <div className={styles.navButtons}>
            <div className={styles.navButtonContainer}>
              <button
                onClick={() => navigate("/update-password")}
                className={styles.navButton}
              >
                비밀번호 변경
              </button>
            </div>
            <div className={styles.navButtonContainer}>
              <button
                onClick={() => navigate("/logout")}
                className={styles.navButton}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerInfoPage;
