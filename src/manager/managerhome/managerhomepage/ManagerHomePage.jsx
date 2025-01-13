import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import ManagerInfo from "../managerhome/managerinfo/ManagerInfo";
import BenefitsSection from "../managerhome/benefitssection/BenefitsSection";
import styles from "./ManagerHomePage.module.css";

const ManagerHomePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleApplyClick = () => {
    navigate("/signup"); // "/signup"으로 이동
  };

  return (
    <div className={styles.managerHomePage}>
      <ManagerInfo />
      <BenefitsSection />
      <div className={styles.applyButtonContainer}>
        <button
          className={styles.applyButton}
          onClick={handleApplyClick} // 클릭 이벤트 추가
        >
          지원하기
        </button>
      </div>
    </div>
  );
};

export default ManagerHomePage;
