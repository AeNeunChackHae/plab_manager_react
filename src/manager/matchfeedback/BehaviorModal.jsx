import React, { useState } from 'react';
import styles from './BehaviorModal.module.css';

const BehaviorModal = ({ player, onBlacklist, onSubmit, onClose }) => {
  const [selectedIssues, setSelectedIssues] = useState([]);

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const issues = [
    '반말을 사용해요',
    '폭언, 욕설을 해요',
    '지시가 심해요',
    '보복성 플레이를 해요',
    '개인 플레이가 심해요',
    '플레이가 거칠어요',
    '폭행, 싸움 등이 있었어요',
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{`${player.team} ${player.number}번, 아쉬워요!`}</h2>
        <p>
          안전하고 즐거운 풋볼플랫폼을 다같이 만들어가요.
          <br />
          비매너 평가 내역자는 공개되지 않습니다.
        </p>
        <div className={styles.issues}>
          {issues.map((issue, index) => (
            <label key={index} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => toggleIssue(issue)}
              />
              {issue}
            </label>
          ))}
        </div>
        <button className={styles.blacklistButton} onClick={onBlacklist}>
          블랙리스트 등록하기
        </button>
        <button className={styles.submitButton} onClick={onSubmit}>
          제출하기
        </button>
      </div>
    </div>
  );
};

export default BehaviorModal;
