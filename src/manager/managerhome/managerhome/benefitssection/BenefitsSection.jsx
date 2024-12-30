import React from "react";
import styles from "./BenefitsSection.module.css";

const BenefitsSection = () => {
  return (
    <section className={styles.benefitsSection}>
      <h4 className={styles.title}>장점</h4>
      <div className={styles.benefit}>
        <img
          className={styles.icon}
          src="https://cdn-icons-png.flaticon.com/512/3231/3231063.png" 
          alt="Icon 1"
          width="36"
          height="36"
        />
        <div>
          <p className={styles.benefitTitle}>좋아하는 축구 풋살로 돈도 벌어요</p>
          <p className={styles.benefitDetail}>기본 시급 12,500원</p>
        </div>
      </div>

      <div className={styles.benefit}>
        <img
          className={styles.icon}
          src="https://media.istockphoto.com/id/1281773975/ko/%EB%B2%A1%ED%84%B0/%ED%8E%98%EB%8B%88-%EC%8A%A4%ED%84%B8%EB%A7%81-%EB%8F%99%EC%A0%84-%ED%8C%8C%EC%9A%B4%EB%93%9C-%EC%8A%A4%ED%84%B8%EB%A7%81%EC%9D%98-%EC%84%B8%EB%B6%84%ED%99%94.jpg?s=612x612&w=0&k=20&c=lbigPUZXDboeNzXWISILkXDl_A65eYdElZFANMq0zj0=" // 두 번째 아이콘 이미지 링크
          alt="Icon 2"
          width="36"
          height="37"
        />
        <div>
          <p className={styles.benefitTitle}>매치에 따라 더 많은 돈을 벌 수 있어요</p>
          <p className={styles.benefitDetail}>
            일반 매치: 25,000원~35,000원
            <br />
            8vs8 매치, PTL: 35,000원
            <br />
            11vs11 매치: 40,000원
          </p>
          <p className={styles.extraDetail}>
            <span>
              일반 매치: 4vs4, 5vs5, 6vs6
              <br />
              사업소득세(3.3%)를 공제합니다
            </span>
          </p>
        </div>
      </div>

      <div className={styles.benefit}>
        <img
          className={styles.icon}
          src="https://media.istockphoto.com/id/1196629871/ko/%EB%B2%A1%ED%84%B0/16-eps.jpg?s=612x612&w=0&k=20&c=5QzYKBL8werU8PF0_uCiWc2k3tR-IDR0LvJ1Px4a5H8=" // 세 번째 아이콘 이미지 링크
          alt="Icon 3"
          width="36"
          height="36"
        />
        <div>
          <p className={styles.benefitTitle}>부업, N잡으로 할 수 있어요</p>
          <p className={styles.benefitDetail}>
            평일 주말 내가 원하는 시간, 구장 선택
          </p>
        </div>
      </div>

      <div className={styles.benefit}>
        <img
          className={styles.icon}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDy0J6cZyiW_qotYwR_6L9vAquoXnYRNa_3Np_LAXsdi5eR1pue2X5b7G4eptuXYKyNVA&usqp=CAU" // 네 번째 아이콘 이미지 링크
          alt="Icon 4"
          width="36"
          height="36"
        />
        <div>
          <p className={styles.benefitTitle}>소셜 매치에 무료로 참여할 수 있어요</p>
          <p className={styles.benefitDetail}>특정 매치 무료 참여 가능</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
