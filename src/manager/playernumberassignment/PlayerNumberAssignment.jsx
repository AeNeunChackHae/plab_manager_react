import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../playernumberassignment/PlayerNumberAssignment.module.css';

const players = [
  { id: 0, name: '용병' },
  { id: 1, name: '황일찬' },
  { id: 2, name: '이종민' },
  { id: 3, name: '박치호' },
  { id: 4, name: '백준규' },
  { id: 5, name: '안승균' },
  { id: 6, name: '김정섭' },
  { id: 7, name: '강민기' },
  { id: 8, name: '강시원' },
  { id: 9, name: '박건우' },
  { id: 10, name: '이유진' },
  { id: 11, name: '김주호' },
  { id: 12, name: '김성진' },
  { id: 13, name: '류정원' },
  { id: 14, name: '김사과' },
  { id: 15, name: '바나나' },
  { id: 16, name: '이키위' },
  { id: 17, name: '박체리' },
  { id: 18, name: '정석류' },
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
  const [pomModal, setPomModal] = useState(false);
  const [redCardModal, setRedCardModal] = useState(false);
  const [yellowCardModal, setYellowCardModal] = useState(false);
  const [pomPlayers, setPomPlayers] = useState([]); // Player of the Match 상태 관리
  const [yellowCards, setYellowCards] = useState([]); // Yellow Cards 상태 추가
  const [redCards, setRedCards] = useState([]); // Red Cards 상태 추가

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const updateTeamSlots = (team, slotIndex, playerData) => {
    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = playerData;
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
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
        alert(`${selectedPlayer}의 불참이 취소되었습니다.`);
      }
    } else {
      setAbsentPlayers((prev) => [...prev, selectedPlayer]);
      alert(`${selectedPlayer}이(가) 불참으로 지정되었습니다.`);
    }

    setSelectedPlayer('');
  };

  const assignPlayerToSlot = (team, slotIndex) => {
    const selectedSlot = teamSlots[team][slotIndex];

    if (selectedSlot.player) {
      const confirmRemove = window.confirm(`${selectedSlot.player} 선수를 슬롯에서 제거하시겠습니까?`);
      if (confirmRemove) {
        updateTeamSlots(team, slotIndex, { player: null, card: [] });
      }
      return; // 제거 후 종료
    }

    if (!selectedPlayer) {
      alert('선수를 먼저 선택해주세요!');
      return;
    }

    if (selectedPlayer !== '용병' && absentPlayers.includes(selectedPlayer)) {
      alert('불참 인원은 슬롯에 넣을 수 없습니다.');
      setSelectedPlayer('');
      return;
    }

    if (
      selectedPlayer !== '용병' &&
      Object.values(teamSlots).some((team) => team.some((slot) => slot.player === selectedPlayer))
    ) {
      alert('이 선수는 이미 다른 슬롯에 배정되었습니다.');
      return;
    }

    updateTeamSlots(team, slotIndex, { player: selectedPlayer, card: [] });
    setSelectedPlayer('');
  };

  const handleGameStart = () => {
    const isAllSlotsFilled = Object.values(teamSlots).every((team) =>
      team.every((slot) => slot.player !== null)
    );

    if (!isAllSlotsFilled) {
      alert('빈 자리를 확인해주세요. 불참 인원은 용병으로 채워야 합니다.');
      return;
    }
    setIsGameStarted(true);
    alert('경기가 시작되었습니다!');
  };

  const handleGameEnd = () => {
    alert('경기가 종료되었습니다!');
    setIsGameStarted(false);
    setSelectedPlayer('');
    setTeamSlots({
      red: Array(6).fill({ player: null, card: [] }),
      yellow: Array(6).fill({ player: null, card: [] }),
      blue: Array(6).fill({ player: null, card: [] }),
    });
    setAbsentPlayers([]);
    setPomPlayers([]);
    setYellowCards([]); // 상태 초기화
    setRedCards([]); // 상태 초기화
    setPomModal(false);
    setRedCardModal(false);
    setYellowCardModal(false);
  };

  const handlePomSelection = (player) => {
    if (pomPlayers.length >= 3) {
      alert('Player of the Match는 최대 3명까지 선택할 수 있습니다.');
      return;
    }
    setPomPlayers((prev) => [...prev, player]);
    alert(`${player}가 Player of the Match로 선택되었습니다.`);
  };

  const handleSave = () => {
    // 저장 로직
    alert(`${pomPlayers.join(', ')}가(이) 저장되었습니다.`);
  };

  const handleClose = () => {
    setPomModal(false);
    setPomPlayers([]); // 닫을 때 선택된 플레이어 리셋
  };

  const handleCardSelection = (player, cardType) => {
    if (cardType === 'yellow') {
      setYellowCards((prev) => [...prev, player]); // Yellow Cards 상태 업데이트
      alert(`${player}에게 옐로카드를 부여했습니다.`);
    } else if (cardType === 'red') {
      setRedCards((prev) => [...prev, player]); // Red Cards 상태 업데이트
      alert(`${player}에게 레드카드를 부여했습니다.`);
    }
  };

  return (
    <div className={styles.appContainer} onClick={closeDropdown}>
      <div
        className={`${styles.layout} ${isGameStarted ? styles.centeredLayout : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 선수 선택 영역 */}
        <div className={`${styles.leftContainer} ${isGameStarted ? styles.hidden : ''}`}>
          <div className={styles.dropdownWrapper}>
            <button className={styles.dropdownToggle} onClick={toggleDropdown}>
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
                    onClick={() => setSelectedPlayer(player.name)}
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 팀 슬롯 */}
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

      {/* 하단 버튼들 */}
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
              Player of the Match
            </button>
            <button onClick={() => setRedCardModal(true)} className={styles.redCardButton}>
              레드카드
            </button>
            <button onClick={() => setYellowCardModal(true)} className={styles.yellowCardButton}>
              옐로카드
            </button>
            <button onClick={handleGameEnd} className={styles.endGameButton}>
              경기 종료
            </button>
          </div>
        )}
      </div>

      {/* 모달 - Player of the Match */}
      {pomModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Player of the Match</h2>
            <div className={styles.playerGrid}>
              {players.map((player) => (
                <button
                  key={player.id}
                  className={`${styles.playerButton} ${
                    pomPlayers.includes(player.name) ? styles.selected : ''
                  }`}
                  onClick={() => handlePomSelection(player.name)}
                >
                  {player.name}
                </button>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSave}>
                저장
              </button>
              <button className={styles.closeButton} onClick={handleClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 레드카드 및 옐로카드 모달 */}
      {redCardModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>레드카드 부여</h2>
            <div className={styles.playerGrid}>
            {players.map((player) => (
              <button 
              key={player.id} 
              className={`${styles.playerButton}`} 
              onClick={() => handleCardSelection(player.name, 'red')}>
                {player.name}
              </button>
            ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSave}>
                저장
              </button>
              <button className={styles.closeButton} onClick={handleClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {yellowCardModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>옐로카드 부여</h2>
            <div className={styles.playerGrid}>
            {players.map((player) => (
              <button key={player.id}
              className={`${styles.playerButton}`} 
               onClick={() => handleCardSelection(player.name, 'yellow')}>
                {player.name}
              </button>
            ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSave}>
                저장
              </button>
              <button className={styles.closeButton} onClick={handleClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerNumberAssignment;
