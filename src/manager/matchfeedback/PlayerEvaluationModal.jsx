import React from 'react';
import styles from './PlayerEvaluationModal.module.css';

const PlayerEvaluationModal = ({ players, onSelect, onClose }) => {
  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫기 방지
      >
        <h2>어떤 팀이었나요?</h2>
        <p>경기 중 비매너 유저를 선택해주세요</p>
        <div className={styles.teams}>
          {/* 선수 리스트 */}
          {players.map((player) => (
            <button
              key={player.id}
              className={styles.playerButton}
              onClick={() => {
                console.log('선택된 선수:', player); // 디버깅 로그
                onSelect(player); // 부모 컴포넌트의 상태 업데이트
              }}
            >
              {`${player.team} ${player.number}번`}
            </button>
          ))}
        </div>
        <button className={styles.nextButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default PlayerEvaluationModal;
