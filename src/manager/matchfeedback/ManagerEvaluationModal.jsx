import React from 'react';
import styles from './ManagerEvaluationModal.module.css'

const ManagerEvaluationModal = ({ type, onClose }) => {
  const badFeedbackOptions = [
    '경기에 집중해 주세요',
    '경기가 과열되지 않게 해주세요',
    '조끼 관리에 신경 써 주세요',
    '볼이 물렁거리거나 딱딱해요',
    '매니저가 늦어 매치가 지연 되었어요',
    '목소리가 잘 안 들려요',
    '팀 밸런스가 잘 안 맞았어요',
  ];

  const goodFeedbackOptions = [
    '친절해요',
    '시간 분배를 잘해요',
    '팀 밸런스를 잘 맞춰요',
    '분위기를 좋게 만들어줘요',
    '경기 시작 전 설명이 충분해요',
    '상황 대처가 좋아요',
    '경기 운영에 집중해요',
  ];

  const feedbackOptions =
    type === 'mannerBad' || type === 'playerBad' || type === 'facilityBad'
      ? badFeedbackOptions
      : goodFeedbackOptions;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>
          {type === 'mannerBad' && '매니저의 아쉬운 점을 알려주세요'}
          {type === 'mannerGood' && '매니저 칭찬해 주세요'}
          {type === 'playerBad' && '플레이어 비매너를 알려주세요'}
          {type === 'playerGood' && '플레이어를 평가해주세요'}
          {type === 'facilityBad' && '구장의 아쉬운 점을 알려주세요'}
          {type === 'facilityGood' && '구장을 칭찬해 주세요'}
        </h2>
        <form>
          {feedbackOptions.map((option, index) => (
            <div key={index} className={styles.checkboxContainer}>
              <input type="checkbox" id={`option-${index}`} />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
          <button type="button" onClick={onClose} className={styles.submitButton}>
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerEvaluationModal;
