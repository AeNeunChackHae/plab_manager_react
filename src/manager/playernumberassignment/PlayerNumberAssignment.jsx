import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from '../playernumberassignment/PlayerNumberAssginment.module.css';

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
  const [teamSlots, setTeamSlots] = useState({
    red: Array(6).fill({ player: null, card: [] }),
    yellow: Array(6).fill({ player: null, card: [] }),
    blue: Array(6).fill({ player: null, card: [] }),
  });
  const [absentPlayers, setAbsentPlayers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [cardModal, setCardModal] = useState({ show: false, type: null });
  const [cardConfirmModal, setCardConfirmModal] = useState(null);
  const [pomModal, setPomModal] = useState(false);
  const [selectedPOM, setSelectedPOM] = useState([]);

  const handleSelectPlayer = (playerName) => {
    setSelectedPlayer(playerName);
  };

  const assignPlayerToTeam = (team, slotIndex) => {
    if (!selectedPlayer) {
      alert('선수를 선택해주세요!');
      return;
    }

    if (teamSlots[team][slotIndex].player) {
      alert('이 슬롯은 이미 차지되었습니다.');
      return;
    }

    for (const slots of Object.values(teamSlots)) {
      if (slots.some((slot) => slot.player === selectedPlayer)) {
        alert('선수가 이미 다른 슬롯에 있습니다.');
        return;
      }
    }

    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = { player: selectedPlayer, card: [] };
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
    setSelectedPlayer('');
  };

  const markPlayerAbsent = () => {
    if (!selectedPlayer) return alert('선수를 선택해주세요!');
    setAbsentPlayers((prev) => [...prev, selectedPlayer]);
    setSelectedPlayer('');
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleGameEnd = () => {
    alert('경기가 종료되었습니다!');
    setIsGameStarted(false);
  };

  const handleCardSelection = (type) => {
    setCardModal({ show: true, type });
  };

  const closeModal = () => {
    setCardModal({ show: false, type: null });
    setCardConfirmModal(null);
    setPomModal(false);
  };

  const assignCardToPlayer = (team, index) => {
    const playerSlot = teamSlots[team][index];
    if (!playerSlot.player) return;

    if (
      (cardModal.type === 'red' && playerSlot.card.includes('red')) ||
      (cardModal.type === 'yellow' && playerSlot.card.filter((c) => c === 'yellow').length >= 2)
    ) {
      return alert('이 선수가 이미 최대 카드를 받았습니다.');
    }

    setCardConfirmModal({
      player: playerSlot.player,
      team,
      index,
      type: cardModal.type,
    });
  };

  const confirmCardAssignment = () => {
    const { team, index, type } = cardConfirmModal;

    const updatedSlots = [...teamSlots[team]];
    updatedSlots[index].card.push(type);
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
    closeModal();
  };

  const handlePOMSelection = (team, index) => {
    const maxPOMCount = 3;
    const player = teamSlots[team][index].player;

    if (!player) {
      alert('선수를 선택해주세요!');
      return;
    }

    if (selectedPOM.length >= maxPOMCount) {
      alert(`최대 ${maxPOMCount}명의 POM을 선택할 수 있습니다.`);
      return;
    }

    if (selectedPOM.includes(player)) {
      alert('선수가 이미 POM으로 선정되었습니다.');
      return;
    }

    setSelectedPOM((prev) => [...prev, player]);
  };

  return (
    <div className={styles.appContainer}>
      {/* 드롭다운 */}
      <div className={styles.dropdownContainer}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedPlayer || '선수 선택'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {players.map((player) => (
              <Dropdown.Item
                key={player.id}
                onClick={() => handleSelectPlayer(player.name)}
                style={{
                  backgroundColor: absentPlayers.includes(player.name) ? 'red' : 'white',
                  color: absentPlayers.includes(player.name) ? 'white' : 'black',
                }}
              >
                {player.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 팀 슬롯 */}
      <div className={styles.teamsContainer}>
        {Object.keys(teamSlots).map((team) => (
          <div key={team} className={styles.teamContainer}>
            <img
              src={`/assets/image/${team}Vest.png`}
              alt={`${team} Vest`}
              className={styles.teamVest}
            />
            <div className={styles.slots}>
              {teamSlots[team].map((slot, index) => (
                <div
                  key={index}
                  className={styles.slot}
                  onClick={() => {
                    if (!isGameStarted) {
                      assignPlayerToTeam(team, index);
                    }
                  }}
                >
                  {slot.player || `#${index + 1}`}
                  {slot.card.length > 0 && (
                    <span
                      className={styles.cardIcon}
                      style={{
                        backgroundColor: slot.card.includes('red') ? 'red' : 'yellow',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 버튼들 */}
      <div className={styles.actionButtons}>
        {!isGameStarted ? (
          <>
            <button onClick={markPlayerAbsent} className={styles.absentButton}>
              불참
            </button>
            <button onClick={handleGameStart} className={styles.startGameButton}>
              경기 시작
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPomModal(true)} className={styles.pomButton}>
              Player of The Match
            </button>
            <button onClick={() => handleCardSelection('red')} className={styles.redCardButton}>
              레드카드
            </button>
            <button onClick={() => handleCardSelection('yellow')} className={styles.yellowCardButton}>
              옐로카드
            </button>
            <button onClick={handleGameEnd} className={styles.endGameButton}>
              경기 종료
            </button>
          </>
        )}
      </div>

      {/* POM 모달 */}
      {pomModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Player of The Match</h2>
            <p>선수를 선택해주세요 (최대 3명).</p>
            <div className={styles.slots}>
              {Object.keys(teamSlots).map((team) =>
                teamSlots[team].map((slot, index) =>
                  slot.player ? (
                    <button
                      key={`${team}-${index}`}
                      className={styles.slotButton}
                      onClick={() => handlePOMSelection(team, index)}
                      style={{
                        backgroundColor: selectedPOM.includes(slot.player)
                          ? '#90ee90'
                          : '',
                      }}
                    >
                      {slot.player}
                    </button>
                  ) : null
                )
              )}
            </div>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {/* POM 확인 */}
      {selectedPOM.length > 0 && (
        <div className={styles.pomList}>
          <h3>선정된 Player of The Match</h3>
          <ul>
            {selectedPOM.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}
	  {/* 카드 모달 */}
{cardModal.show && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div
      className={styles.modalContent}
      style={{ width: '600px', height: '500px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>{cardModal.type === 'red' ? '레드카드' : '옐로카드'} 부여</h2>
      <p>카드를 부여할 선수를 선택해주세요.</p>
      <div className={styles.teamsContainer}>
        {Object.keys(teamSlots).map((team) => (
          <div key={team} className={styles.teamContainer}>
            <h3>{team.toUpperCase()} 팀</h3>
            <div className={styles.slots}>
              {teamSlots[team].map(({ player }, index) =>
                player ? (
                  <button
                    key={`${team}-${index}`}
                    className={styles.slotButton}
                    onClick={() => assignCardToPlayer(team, index)}
                  >
                    {player}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={closeModal} className={styles.closeButton}>
        닫기
      </button>
    </div>
  </div>
)}

{/* 카드 부여 확인 모달 */}
{cardConfirmModal && (
  <div className={styles.modalOverlay} onClick={() => setCardConfirmModal(null)}>
    <div
      className={styles.modalContent}
      style={{ width: '400px', height: '250px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>카드 부여 확인</h2>
      <p>
        {cardConfirmModal.player}에게{' '}
        {cardConfirmModal.type === 'red' ? '레드카드' : '옐로카드'}를
        부여하시겠습니까?
      </p>
      <div className={styles.actionButtons}>
        <button onClick={confirmCardAssignment} className={styles.confirmButton}>
          확인
        </button>
        <button onClick={() => setCardConfirmModal(null)} className={styles.cancelButton}>
          취소
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PlayerNumberAssignment;
