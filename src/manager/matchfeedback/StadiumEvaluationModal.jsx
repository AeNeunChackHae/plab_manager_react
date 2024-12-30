import React, { useState } from 'react';
import styles from './ManagerEvaluationModal.module.css';

const ManagerEvaluationModal = ({ type, onClose }) => {
  // 평가 항목 리스트
  const feedbackOptions = {
    facilityBad: [
      '시설 정보가 달라요',
      '잔디 상태가 안 좋아요',
      '화장실이 청결하지 않아요',
      '샤워실이 체계적이지 않아요',
      '대기 공간이 불편해요',
      '주차하기 불편해요',
      '접근성이 불편해요',
      '야간 조명이 어두워요',
    ],
    facilityGood: [
      '시설 정보가 정확해요',
      '잔디 상태가 좋아요',
      '화장실이 깨끗해요',
      '샤워실이 잘 되어 있어요',
      '대기 공간이 쾌적해요',
      '주차하기 편해요',
      '접근성이 좋아요',
      '가격이 합리적이에요',
    ],
  };

  // 선택된 항목 관리
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = feedbackOptions[type] || [];

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    console.log('Selected feedback for facility:', selectedOptions);
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{type === 'facilityBad' ? '아쉬운 점을 선택해주세요' : '좋았던 점을 선택해주세요'}</h2>
        <p>더 나은 환경에서의 매치를 위해 플레이어들의 의견을 주세요 (복수 선택 가능)</p>
        <form>
          {options.map((option, index) => (
            <div key={index} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`option-${index}`}
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerEvaluationModal;
