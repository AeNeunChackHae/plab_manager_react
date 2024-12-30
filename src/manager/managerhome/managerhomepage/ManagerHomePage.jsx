import React from "react";
import ManagerInfo from "../../components/managerhome/managerinfo/ManagerInfo";
import BenefitsSection from "../../components/managerhome/benefitssection/BenefitsSection";
import styles from "./ManagerHomePage.module.css";

const App = () => {
  return (
    <div className={styles.managerHomePage}>
      <ManagerInfo />
      <BenefitsSection/>
      <div className={styles.applyButtonContainer}>
        <button className={styles.applyButton}>지원하기</button>
      </div>
    </div>
  );
};

export default App;