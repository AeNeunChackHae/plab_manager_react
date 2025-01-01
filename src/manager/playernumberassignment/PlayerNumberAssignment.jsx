import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../playernumberassignment/PlayerNumberAssginment.module.css';

const players = [
  { id: 0, name: '용병' },
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
  const location = useLocation();
  const { matchId } = location.state || {}; // 전달된 match_id 가져오기

  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [teamSlots, setTeamSlots] = useState({
    red: Array(6).fill({ player: null, card: [] }),
    yellow: Array(6).fill({ player: null, card: [] }),
    blue: Array(6).fill({ player: null, card: [] }),
  });
  const [absentPlayers, setAbsentPlayers] = useState([]); 
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedPOM, setSelectedPOM] = useState([]);
  const [pomModal, setPomModal] = useState(false);
  const [cardModal, setCardModal] = useState({ show: false, type: null });
  const [cardConfirmModal, setCardConfirmModal] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => { 
    setIsDropdownOpen(false); 
  }; 

  const togglePlayerAbsent = (playerName) => {
    if (absentPlayers.includes(playerName)) {
      const confirmCancel = window.confirm('불참을 취소하시겠습니까?');
      if (confirmCancel) {
        setAbsentPlayers(absentPlayers.filter((player) => player !== playerName));
        alert(`${playerName}의 불참이 취소되었습니다.`);
      }
    } else {
      setAbsentPlayers((prev) => [...prev, playerName]);
      alert(`${playerName}이(가) 불참으로 지정되었습니다.`);
    }
  };
  
  const handleSelectPlayer = (playerName) => {
    if (absentPlayers.includes(playerName)) {
      const confirmCancel = window.confirm('불참을 취소하시겠습니까?');
      if (confirmCancel) {
        setAbsentPlayers(absentPlayers.filter((player) => player !== playerName));
        alert(`${playerName}의 불참이 취소되었습니다.`);
      }
    } else {
      setSelectedPlayer(playerName);
      setIsDropdownOpen(false); // 드롭다운 닫기
    }
  };
  
  
  const assignPlayerToSlot = (team, slotIndex) => {
    if (!selectedPlayer) {
      alert('선수를 먼저 선택해주세요!');
      return;
    }
  
    if (absentPlayers.includes(selectedPlayer)) {
      alert('불참 인원은 슬롯에 넣을 수 없습니다.');
      setSelectedPlayer(''); // 선택 초기화
      return;
    }
  
    if (teamSlots[team][slotIndex].player) {
      alert('이 슬롯은 이미 배정되었습니다.');
      return;
    }
  
    for (const slots of Object.values(teamSlots)) {
      if (slots.some((slot) => slot.player === selectedPlayer)) {
        alert('이 선수는 이미 다른 슬롯에 배정되었습니다.');
        return;
      }
    }
  
    // 슬롯에 선수 배정
    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = { player: selectedPlayer, card: [] };
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
    setSelectedPlayer('');
  };
  
  const markPlayerAbsent = () => {
    if (!selectedPlayer) {
      alert('선수를 선택해주세요!');
      return;
    }
  
    if (absentPlayers.includes(selectedPlayer)) {
      const confirmCancel = window.confirm('불참 상태를 취소하시겠습니까?');
      if (confirmCancel) {
        setAbsentPlayers(absentPlayers.filter((player) => player !== selectedPlayer));
      }
    } else {
      setAbsentPlayers((prev) => [...prev, selectedPlayer]);
    }
  
    setSelectedPlayer(''); // 선택 초기화
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleGameEnd = () => {
    alert('경기가 종료되었습니다!');
    
    // 상태 초기화
    setIsGameStarted(false); // 경기 상태 초기화
    setSelectedPlayer(''); // 선택된 선수 초기화
    setTeamSlots({
      red: Array(6).fill({ player: null, card: [] }),
      yellow: Array(6).fill({ player: null, card: [] }),
      blue: Array(6).fill({ player: null, card: [] }),
    }); // 팀 슬롯 초기화
    setAbsentPlayers([]); // 불참 선수 초기화
    setSelectedPOM([]); // Player of The Match 초기화
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
    if (!playerSlot.player) {
      alert('선수를 선택해주세요!');
      return;
    }

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
    <div className={styles.appContainer} onClick={closeDropdown}>
      <div className={styles.layout} onClick={(e) => e.stopPropagation()}>
        <div className={styles.leftContainer}>
          <div className={styles.dropdownWrapper}>
            <button
              className={styles.dropdownToggle}
              onClick={toggleDropdown}
            >
              {selectedPlayer || '선수 선택'}
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {players.map((player) => (
                <div
                  key={player.id}
                  className={`${styles.dropdownItem} ${
                    absentPlayers.includes(player.name) ? styles.absent : ''
                  }`}
                  onClick={() => handleSelectPlayer(player.name)} // 클릭 이벤트 추가
                  style={{
                    cursor: 'pointer', // 마우스 포인터 변경
                    pointerEvents: 'auto', // 클릭 가능하도록 설정
                  }}
                >
                  {player.name}
                </div>
            ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightContainer}>
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
                      onClick={() => assignPlayerToSlot(team, index)}
                    >
                      {slot.player || `#${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        {!isGameStarted ? (
          <div className={styles.twoButton}>
            <button onClick={markPlayerAbsent} className={styles.absentButton}>
              불참
            </button>
            <button onClick={handleGameStart} className={styles.startGameButton}>
              경기 시작
            </button>
          </div>
        ) : (
          <div className={styles.fourButton}>
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
          </div>
        )}
      </div>
      {pomModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
                        backgroundColor: selectedPOM.includes(slot.player) ? '#90ee90' : '',
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

      {cardModal.show && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{cardModal.type === 'red' ? '레드카드' : '옐로카드'} 부여</h2>
            <p>카드를 부여할 선수를 선택해주세요.</p>
            <div className={styles.teamsContainer}>
              {Object.keys(teamSlots).map((team) => (
                <div key={team} className={styles.teamContainer}>
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
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {cardConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setCardConfirmModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>카드 부여 확인</h2>
            <p>
              {cardConfirmModal.player}에게{' '}
              {cardConfirmModal.type === 'red' ? '레드카드' : '옐로카드'}를 부여하시겠습니까?
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
