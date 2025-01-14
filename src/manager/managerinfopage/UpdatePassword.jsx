import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UpdatePassword.css";
import { config } from "../../config";

const PasswordChange = () => {
  const api = config.aws.ec2_host_manager
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const storedId = localStorage.getItem("userId"); // 스토리지에서 ID 가져오기

  // 사용자 이메일 불러오기
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        if (!storedId) {
          throw new Error("스토리지에서 ID를 찾을 수 없습니다.");
        }

        const response = await fetch(`${api}/auth/manager-info`,
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

        if (!response.ok) {
          throw new Error("사용자 이메일을 불러오지 못했습니다.");
        }

        const data = await response.json();
        if (data.email) {
          setEmail(data.email); // 이메일 상태 업데이트
        } else {
          throw new Error("응답에서 이메일 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
        alert(`오류: ${error.message}`);
      }
    };

    fetchUserEmail();
  }, []);

  // 비밀번호 변경
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (currentPassword === newPassword) {
      alert("새 비밀번호는 기존 비밀번호와 달라야 합니다.");
      return;
    }

    try {
      const response = await fetch(`${api}/auth/update-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            userId: storedId, // 스토리지에서 가져온 ID를 전달
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message || "비밀번호가 성공적으로 변경되었습니다.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/schedule-list");
      } else {
        alert(data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert(`오류: ${error.message}`);
    }
  };

  return (
    <div className="container">
      {/* 이메일 표시 */}
      <p className="email">{email || "이메일을 불러오는 중입니다..."}</p>

      <div className="section">
        <label className="label">기존 비밀번호 </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input"
        />
      </div>

      <div className="section">
        <label className="label">새 비밀번호 </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
        />
        <ul className="passwordHint">
          <li>비밀번호는 최소 8자 이상이어야 합니다.</li>
        </ul>
      </div>

      <div className="section">
        <label className="label">새 비밀번호(확인) </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />
      </div>

      <button className="saveButton" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
};

export default PasswordChange;
