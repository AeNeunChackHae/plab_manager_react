import React from "react";
import styles from "./ManagerInfo.module.css";

const ManagerInfo = () => {
  return (
    <section className={styles.managerInfoSection}>
      <h2 className={styles.title}>플랩매니저란?</h2>
      <p className={styles.description}>
        플랩풋볼 소셜 매치를 진행하는 매니저예요<br />
        오늘 처음 소셜 매치로 만난 플래버들이
        즐겁게 운동할 수 있도록 도와주는 역할을 해요
      </p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <h4>대상</h4>
          <p>축구 풋살을 좋아하는 만 19세 이상 누구나</p>
        </div>
        <div className={styles.detailItem}>
          <h4>하는 일</h4>
          <p>매치 준비 → 매치 진행 → 매치 리포트 작성</p>
        </div>
      </div>
    </section>
  );
};

export default ManagerInfo;
