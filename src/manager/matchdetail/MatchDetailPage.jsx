import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../matchdetail/MatchDetailPage.module.css';
import schedules from '../data/schedules.json';

const Modal = ({ onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <p>신청 완료! 나의 매치 탭에서 확인하세요.</p>
      <button onClick={onClose}>확인</button>
    </div>
  </div>
);

const MatchDetail = ({ matchId }) => { // matchId를 prop으로 받아야 합니다.
  const [showModal, setShowModal] = useState(false);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // matchId로 매치 데이터 찾기
    const foundSchedule = schedules.find(schedule => schedule.schedules.some(s => s.id === matchId));
    if (foundSchedule) {
      const foundMatch = foundSchedule.schedules.find(s => s.id === matchId);
      setMatch(foundMatch);
    }
  }, [matchId]);

  if (!match) {
    return <p>매치 정보가 존재하지 않습니다.</p>;
  }

  const handleApplyClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/matches/${matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your_auth_token', // 필요 시 인증 토큰 추가
        },
        body: JSON.stringify({ matchId: match.id }),
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(true);
      } else {
        console.error('매치 신청 실패:', data.message);
      }
    } catch (error) {
      console.error('매치 신청 중 오류 발생:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/schedule-list'); // 수정된 경로
  };

  const handleBackClick = () => {
    navigate('/schedule-list'); // 수정된 경로
  };

  return (
    <div className={styles.container}>
      <h1>매치 선택</h1>
      <div className={styles.header}>
        <p>{match.date} {match.time}</p>
        <p>{match.location}</p>
        <p>남녀모두 · 팀매치</p>
      </div>
      <div className="match-cost">
        <p>25,000 / 2시간</p>
      </div>
      <div className="match-details">
        <h2>구장 특이사항</h2>
        <p>구장 가는 길: 천마풋살파크 검색 (서울 송파구 성내천로29길 31)</p>
        <p>*GS25 마천우방점 옆 골목 250미터 직진</p>
        <p>-구장 구분: 입구 쪽 3구장, 가운데 2구장, 가장 먼 쪽 1구장, 단독으로 있는 구장 4구장</p>
      </div>
      <div className="match-info">
        <p>1주차: 무로(홈페이지 사전 등록 7대)</p>
        <p>소셜매치 시 선착순 7대 주차등록 못했을 경우, 주차 불가</p>
        <p>*주차 사전 미신청자는 주차가 불가능하며 퇴장조치 될 수 있습니다</p>
        <p>사전 주차 신청을 하지 못했을 경우 도로 5분 거리의 천마 공영 주차장을 이용해주세요.</p>
        <p> (서울특별시 송파구 성내천로33가길 20, 30분당 300원)</p>
        <p>*매치 시작 시간 기준 1시간 30분 전까지만 주차 등록 가능</p>
        <p>* 팀 리그: 선착순 팀별로 3대/2대/2대 등록이 가능해요.</p>
        <p>흡연: 건물 뒷편에서만 가능</p>
        <p> *흡연구역 외 절대 금연(흡연구역 외에서 흡연 적발 시 이후 서비스 이용 제재)</p>
      </div>
      <div>
        <button onClick={handleApplyClick}>매치 신청</button>
        <button onClick={handleBackClick}>뒤로 가기</button>
      </div>
      {showModal && <Modal onClose={handleCloseModal} />}
    </div>
  );
};

export default MatchDetail;
