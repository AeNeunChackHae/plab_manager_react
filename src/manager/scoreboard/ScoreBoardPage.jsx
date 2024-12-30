import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ScoreBoardPage.module.css';



function ScoreBoardPage() {
  const [scores, setScores] = useState([
    { teamA: "FC MMM", scoreA: "", teamB: "실더", scoreB: "", logoA: "/assets/image/FCMMM_logo.png", logoB: "/assets/image/Shield_logo.png" },
    { teamA: "FC MMM", scoreA: "", teamB: "RMFC", scoreB: "", logoA: "/assets/image/FCMMM_logo.png", logoB: "/assets/image/RMFC_logo.png" },
    { teamA: "실더", scoreA: "", teamB: "RMFC", scoreB: "", logoA: "/assets/image/Shield_logo.png", logoB: "/assets/image/RMFC_logo.png" },
    { teamA: "실더", scoreA: "", teamB: "FC MMM", scoreB: "", logoA: "/assets/image/Shield_logo.png", logoB: "/assets/image/FCMMM_logo.png" },
    { teamA: "RMFC", scoreA: "", teamB: "FC MMM", scoreB: "", logoA: "/assets/image/RMFC_logo.png", logoB: "/assets/image/FCMMM_logo.png" },
    { teamA: "RMFC", scoreA: "", teamB: "실더", scoreB: "", logoA: "/assets/image/RMFC_logo.png", logoB: "/assets/image/Shield_logo.png" },
    { teamA: "FC MMM", scoreA: "", teamB: "실더", scoreB: "", logoA: "/assets/image/FCMMM_logo.png", logoB: "/assets/image/Shield_logo.png" },
    { teamA: "FC MMM", scoreA: "", teamB: "RMFC", scoreB: "", logoA: "/assets/image/FCMMM_logo.png", logoB: "/assets/image/RMFC_logo.png" },
    { teamA: "실더", scoreA: "", teamB: "RMFC", scoreB: "", logoA: "/assets/image/Shield_logo.png", logoB: "/assets/image/RMFC_logo.png" },
  ]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const handleScoreChange = (index, team, value) => {
    const updatedScores = scores.map((score, i) =>
      i === index ? { ...score, [team]: value } : score
    );
    setScores(updatedScores);
  };

  const handleSubmit = () => {
    setShowModal(true);
    setTimeout(() => {
        setShowModal(false);
        navigate('/schedule-list');
    }, 5000);
  };
  
  return (
    <div className={styles.scoreboardContainer}>
      <header className={styles.header}>
        <h1>팀 매치 스코어</h1>
      </header>
      <table className={styles.scoreTable}>
        <tbody>
          {scores.map((match, index) => (
            <tr key={index}>
              <td>
                <div className={styles.teamInfo}>
                  <img src={match.logoA} alt={`${match.teamA} Logo`} className={styles.teamLogo} />
                  {match.teamA}
                </div>
              </td>
              <td className={styles.score}>
                <input
                  type="text"
                  value={match.scoreA}
                  onChange={(e) => handleScoreChange(index, "scoreA", e.target.value)}
                  className={styles.input}
                  placeholder="점수"
                />
                :
                <input
                  type="text"
                  value={match.scoreB}
                  onChange={(e) => handleScoreChange(index, "scoreB", e.target.value)}
                  className={styles.input}
                  placeholder="점수"
                />
              </td>
              <td>
                <div className={styles.teamInfo}>
                  <img src={match.logoB} alt={`${match.teamB} Logo`} className={styles.teamLogo} />
                  {match.teamB}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.submitButton} onClick={handleSubmit}>제출</button>
      {showModal && (
                <>
                    <div className={styles.overlay}></div>
                    <div className={styles.modal}>
                        <p>매니저님 오늘도 수고했습니다 또 만나요~!</p>
                    </div>
                </>
            )}
    </div>
  );
}

export default ScoreBoardPage;
