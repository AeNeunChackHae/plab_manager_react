import React, { useState } from 'react';
import styles from '../playernumberassignment/PlayerNumberAssginment.module.css';

const teams = {
  red: Array(6).fill(null),
  yellow: Array(6).fill(null),
  blue: Array(6).fill(null),
};

const players = [
  { id: 1, name: '이승만' },
  { id: 2, name: '윤보선' },
  { id: 3, name: '박정희' },
  { id: 4, name: '최규하' },
  { id: 5, name: '전두환' },
  { id: 6, name: '노태우' },
  { id: 7, name: '김영삼' },
  { id: 8, name: '김대중' },
  { id: 9, name: '노무현' },
];

const PlayerNumberAssignment = () => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [teamSlots, setTeamSlots] = useState(teams);
  const [absentPlayers, setAbsentPlayers] = useState([]);
  const [showPOMModal, setShowPOMModal] = useState(false);
  const [cardModal, setCardModal] = useState({ show: false, type: null });

  const handleSelectPlayer = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const assignPlayerToTeam = (team, slotIndex) => {
    if (!selectedPlayer) return alert('선수를 선택해주세요!');
    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = selectedPlayer;
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
    setSelectedPlayer('');
  };

  const markPlayerAbsent = () => {
    if (!selectedPlayer) return alert('선수를 선택해주세요!');
    setAbsentPlayers((prev) => [...prev, selectedPlayer]);
    setSelectedPlayer('');
  };

  const handlePOMSelection = () => {
    setShowPOMModal(true);
  };

  const handleCardSelection = (type) => {
    setCardModal({ show: true, type });
  };

  const closeModal = () => {
    setShowPOMModal(false);
    setCardModal({ show: false, type: null });
  };

  return (
    <div className={styles.appContainer}>
      {/* 드롭다운 */}
      <div className={styles.sidebar}>
        <select value={selectedPlayer} onChange={handleSelectPlayer} className={styles.dropdown}>
          <option value="">선수 선택</option>
          {players.map((player) => (
            <option
              key={player.id}
              value={player.name}
              style={{
                backgroundColor: absentPlayers.includes(player.name) ? 'red' : 'white',
                color: absentPlayers.includes(player.name) ? 'white' : 'black',
              }}
            >
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* 팀 슬롯 */}
      <div className={styles.appContainer}>
  {/* 조끼들을 가로로 나열 */}
  <div className={styles.teamsContainer}>
    <div className={styles.teamContainer}>
      <img src="/assets/image/redVest.png" alt="Red Vest" className={styles.teamVest} />
      <div className={styles.slots}>
        {teamSlots.red.map((player, index) => (
          <div
            key={index}
            className={styles.slot}
            onClick={() => assignPlayerToTeam('red', index)}
          >
            {player || `#${index + 1}`}
          </div>
        ))}
      </div>
    </div>
    <div className={styles.teamContainer}>
      <img src="/assets/image/yellowVest.png" alt="Yellow Vest" className={styles.teamVest} />
      <div className={styles.slots}>
        {teamSlots.yellow.map((player, index) => (
          <div
            key={index}
            className={styles.slot}
            onClick={() => assignPlayerToTeam('yellow', index)}
          >
            {player || `#${index + 1}`}
          </div>
        ))}
      </div>
    </div>
    <div className={styles.teamContainer}>
      <img src="/assets/image/blueVest.png" alt="Blue Vest" className={styles.teamVest} />
      <div className={styles.slots}>
        {teamSlots.blue.map((player, index) => (
          <div
            key={index}
            className={styles.slot}
            onClick={() => assignPlayerToTeam('blue', index)}
          >
            {player || `#${index + 1}`}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      {/* 버튼들 */}
      <div className={styles.actionButtons}>
        <button onClick={markPlayerAbsent} className={styles.absentButton}>
          불참
        </button>
        <button onClick={() => alert('경기 종료!')} className={styles.endGameButton}>
          경기 종료
        </button>
        <button onClick={handlePOMSelection} className={styles.pomButton}>
          Player of The Match
        </button>
        <button onClick={() => handleCardSelection('red')} className={styles.redCardButton}>
          레드카드
        </button>
        <button onClick={() => handleCardSelection('yellow')} className={styles.yellowCardButton}>
          옐로카드
        </button>
      </div>

      {/* POM 모달 */}
      {showPOMModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Player of The Match</h2>
            <p>팀을 선택하고 선수를 선택해주세요.</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {/* 카드 모달 */}
      {cardModal.show && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{cardModal.type === 'red' ? '레드카드' : '옐로카드'}</h2>
            <p>선수를 선택해주세요.</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerNumberAssignment;
