import React, { useState } from 'react';
import ManagerEvaluationModal from './ManagerEvaluationModal';
import StadiumEvaluationModal from './StadiumEvaluationModal';
import PlayerEvaluationModal from './PlayerEvaluationModal';
import BehaviorModal from './BehaviorModal';
import ConfirmationModal from './ConfirmationModal';
import styles from '../matchfeedback/MatchFeedbackPage.module.css';

const players = [
  { id: 1, name: '이승만', team: '빨강', number: 1 },
  { id: 2, name: '윤보선', team: '노랑', number: 2 },
  { id: 3, name: '박정희', team: '파랑', number: 3 },
  { id: 4, name: '최규하', team: '빨강', number: 4 },
];

const FeedbackPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const openModal = (modalType, player = null) => {
    console.log(`모달 열림: ${modalType}, 선택된 선수: ${player?.name}`);
    setSelectedPlayer(player);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPlayer(null);
    setSelectedPlayers([]);
    setCurrentStep(0);
    setCompleted(false);
  };

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.length < 3 && !selectedPlayers.includes(player)) {
      setSelectedPlayers((prev) => [...prev, player]);
      console.log('선택된 선수:', player);
    } else {
      console.log('선수 선택 제한 초과 또는 이미 선택된 선수입니다.');
    }
  };
  

  const handleNextStep = () => {
    if (currentStep < selectedPlayers.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log('모든 단계 완료');
      setCompleted(true);
      setActiveModal(null);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>12월 29일 금요일 20:00</h1>
      <p className={styles.p}>서울 명동 SKY 풋살파크 A구장</p>

      <div className={styles.feedbackSection}>
        {/* 매니저 평가 */}
        <div className={styles.feedbackItem}>
          <p>강민기 매니저는 어땠나요?</p>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => openModal('mannerBad')}>아쉬워요</button>
            <button className={styles.button} onClick={() => openModal('mannerGood')}>좋았어요</button>
          </div>
        </div>

        {/* 플레이어 평가 */}
        <div className={styles.feedbackItem}>
          <p>플레이어들을 평가해주세요!</p>
          <small>
            비매너 신고, 이용 평가 모두 진행할 수 있어요.
            <br />
            개인 경기 관리에 도움을 드리니, 적극적인 평가 부탁해요.
          </small>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => openModal('playerBad')}>비매너가 있어요</button>
            <button className={styles.button} onClick={() => openModal('playerEvaluation')}>평가해주세요</button>
          </div>
        </div>

        {/* 구장 평가 */}
        <div className={styles.feedbackItem}>
          <p>이용 구장은 어땠나요?</p>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => openModal('facilityBad')}>아쉬워요</button>
            <button className={styles.button} onClick={() => openModal('facilityGood')}>좋았어요</button>
          </div>
        </div>
      </div>

      <button className={styles.completeButton}>평가 완료하기</button>

      {/* 모달 렌더링 */}
      {activeModal === 'mannerBad' || activeModal === 'mannerGood' ? (
        <ManagerEvaluationModal type={activeModal} onClose={closeModal} />
      ) : null}

      {activeModal === 'facilityBad' || activeModal === 'facilityGood' ? (
        <StadiumEvaluationModal type={activeModal} onClose={closeModal} />
      ) : null}

      {/* 비매너 모달 */}
      {activeModal === 'playerBad' && (
        <PlayerEvaluationModal
          players={players}
          onSelect={(player) => openModal('behavior', player)}
          onClose={closeModal}
        />
      )}

      {/* 비매너 행동 선택 모달 */}
      {activeModal === 'behavior' && selectedPlayer && (
        <BehaviorModal
          player={selectedPlayer}
          onBlacklist={() => setActiveModal('confirmation')}
          onSubmit={() => setActiveModal('confirmation')}
          onClose={closeModal}
        />
      )}

      {/* 확인 모달 */}
      {activeModal === 'confirmation' && (
        <ConfirmationModal
          message={`${selectedPlayer?.name || '선수'} 님이 블랙리스트로 등록되었습니다.`}
          onClose={closeModal}
        />
      )}

      {/* 칭찬 모달 */}
      {activeModal === 'playerEvaluation' && (
        <PlayerEvaluationModal
          players={players}
          onSelect={(player) => {
            handleSelectPlayer(player);
            setActiveModal('playerPraise');
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'playerPraise' && selectedPlayers[currentStep] && (
        <div className={styles.modal}>
          <h2>{`${selectedPlayers[currentStep].team} ${selectedPlayers[currentStep].number}번, 플레이어는요!`}</h2>
          <p>플레이어를 칭찬해주세요! (다중 선택 가능)</p>
          <div className={styles.issues}>
            <label>
              <input type="checkbox" />
              슈팅이 좋아요!
            </label>
            <label>
              <input type="checkbox" />
              드리블이 좋아요!
            </label>
            <label>
              <input type="checkbox" />
              패스가 훌륭해요!
            </label>
            <label>
              <input type="checkbox" />
              팀워크가 좋아요!
            </label>
          </div>
          <button className={styles.button} onClick={handleNextStep}>
            {currentStep < selectedPlayers.length - 1 ? '다음 선수 선택하기' : '평가 완료하기'}
          </button>
        </div>
      )}

      {completed && (
        <div className={styles.modal}>
          <h2>평가 완료!</h2>
          <p>선수 칭찬 평가가 성공적으로 제출되었습니다.</p>
          <button className={styles.button} onClick={closeModal}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
