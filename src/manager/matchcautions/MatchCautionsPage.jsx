import React from 'react';
import styles from './MatchCautionsPage.module.css'; // CSS 파일 import

const MatchCautions = () => {
  return (
    <div className={styles.cautions_container}>
        <h2 className={styles.header_phrase}>팀 매치 진행 유의 사항</h2>
        <div className={styles.need_firstaid}>
            <h1>부상자가 발생했어요</h1>
            <p>심각한 부상이라면 부상자의 동의를 받은 후 구급차를 불러주세요.</p>
            <p>참가자에게 구급차 비용 발생에 관한 안내가 필요합니다</p>
        </div>
        <p>경미한 부상의 경우 구장 밖에서 잠시 휴식을 취하도록 안내해 주세요</p>
        <p>부상으로 매치가 중단되면 가급적 빠르게 수습 후 재개해 주세요.</p>
        <p>당사자 간 문제가 생기면 원만히 해결하도록 매니저님이 중재해 주세요.</p>
        <h4>유의 사항</h4>
        <ul>
            <li>플랩풋볼에서는 매치신청 시 부상에 대한 책임이 개인에게 있음을 명시하고 있어요.</li>
            <li>큰 부상으로 인한 연락처 교환은 상호 합의 하에 '현장'에서 본인들이 '직접'하는 것을 원칙으로 합니다.</li>
            <li>매치 중 부상으로 뛰지 못한 시간에 대해서는 캐시 환불이 어렵습니다</li>
        </ul>
        <h2>팀 매치 촬영</h2>
            <p>팀매치의 경우 카메라를 통해 경기 영상을 촬영합니다.</p>
            <p>중앙선을 기준으로 양쪽 골대를 향해 삼각대와 카메라를 설치해주세요.</p>
            <p>영상은 쿼터 별로 촬영을 진행하며 매치가 끝난 후 경기 영상은 웹사이트를 통해 업로드 해주세요.</p>
            <p>[영상 업로드 경로]</p>
            <p>나의 정보 &gt; 나의 매치 &gt; 해당 경기 클릭 &gt; 영상 업로드 진행</p>
            <h2>행사 일정 관리</h2>
            <p>내일 3시간 내 노회의 이용 권리리과 <strong>매치 일정 관리</strong></p>
        <h2>POM 선정</h2>
        <p>매니저가 선정하는 POM은 오늘 매치에서 최고의 매너를 보여준 플래버에게 POM을 선물하세요.</p>
        <button className={styles.okayBtn}>위 사항을 확인하였습니다</button>
    </div>
  );
};

export default MatchCautions;
