import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // useNavigate 사용

  // 상태 관리
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [teamSlots, setTeamSlots] = useState({
    red: Array(6).fill({ player: null, card: [] }),
    yellow: Array(6).fill({ player: null, card: [] }),
    blue: Array(6).fill({ player: null, card: [] }),
  });
  const [absentPlayers, setAbsentPlayers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 모달 상태 및 저장/작업 중 상태
  const [activeModal, setActiveModal] = useState(''); // 현재 활성화된 모달
  const [savedPomPlayers, setSavedPomPlayers] = useState([]);
  const [savedYellowCards, setSavedYellowCards] = useState([]);
  const [savedRedCards, setSavedRedCards] = useState([]);
  const [pomPlayers, setPomPlayers] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [redCards, setRedCards] = useState([]);

  // 드롭다운 토글
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  // 슬롯 업데이트
  const updateTeamSlots = (team, slotIndex, playerData) => {
    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = playerData;
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
  };

  // 슬롯에 플레이어 배정 또는 제거
  const assignPlayerToSlot = (team, slotIndex) => {
    const selectedSlot = teamSlots[team][slotIndex];

    if (selectedSlot.player) {
      const confirmRemove = window.confirm(
        `${selectedSlot.player} 선수를 슬롯에서 제거하시겠습니까?`
      );
      if (confirmRemove) {
        updateTeamSlots(team, slotIndex, { player: null, card: [] });
      }
      return;
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
      Object.values(teamSlots).some((team) =>
        team.some((slot) => slot.player === selectedPlayer)
      )
    ) {
      alert('이 선수는 이미 다른 슬롯에 배정되었습니다.');
      return;
    }

    updateTeamSlots(team, slotIndex, { player: selectedPlayer, card: [] });
    setSelectedPlayer('');
  };

  // 불참 처리
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

  // 모달 열기
  const openModal = (modalType) => {
    setActiveModal(modalType);
    if (modalType === 'pom') setPomPlayers([...savedPomPlayers]);
    else if (modalType === 'yellow') setYellowCards([...savedYellowCards]);
    else if (modalType === 'red') setRedCards([...savedRedCards]);
  };

  // 모달 닫기
  const handleClose = () => {
    setActiveModal('');
    setPomPlayers([]);
    setYellowCards([]);
    setRedCards([]);
  };

  // 저장 처리
  const handleSave = () => {
    if (activeModal === 'pom') {
      setSavedPomPlayers([...pomPlayers]);
      alert(`Player of the Match: ${pomPlayers.join(', ')} 저장되었습니다.`);
    } else if (activeModal === 'yellow') {
      setSavedYellowCards([...yellowCards]);
      alert(`옐로카드 부여: ${yellowCards.join(', ')} 저장되었습니다.`);
    } else if (activeModal === 'red') {
      setSavedRedCards([...redCards]);
      alert(`레드카드 부여: ${redCards.join(', ')} 저장되었습니다.`);
    }
    handleClose();
  };

  // 카드 및 POM 선택 처리
  const handleCardOrPOMSelection = (player, type) => {
    let currentList, setList, maxLimit = Infinity;

    if (type === 'pom') {
      currentList = pomPlayers;
      setList = setPomPlayers;
      maxLimit = 3;
    } else if (type === 'yellow') {
      currentList = yellowCards;
      setList = setYellowCards;
    } else if (type === 'red') {
      currentList = redCards;
      setList = setRedCards;
    }

    if (currentList.includes(player)) {
      setList((prev) => prev.filter((p) => p !== player));
    } else if (currentList.length < maxLimit) {
      setList((prev) => [...prev, player]);
    }
  };

  // 게임 시작 및 종료
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
    setTeamSlots({
      red: Array(6).fill({ player: null, card: [] }),
      yellow: Array(6).fill({ player: null, card: [] }),
      blue: Array(6).fill({ player: null, card: [] }),
    });
    setAbsentPlayers([]);
    setSavedPomPlayers([]);
    setSavedYellowCards([]);
    setSavedRedCards([]);
    navigate('/schedule-list')

  }
  return (
    <div className={styles.appContainer}>
      <div className={`${styles.layout} ${isGameStarted ? styles.centeredLayout : ''}`}>
        {/* 왼쪽 선수 선택 영역 */}
        <div className={`${styles.leftContainer} ${isGameStarted ? styles.hidden : ''}`}>
          <div className={styles.dropdownWrapper} onClick={(e) => e.stopPropagation()}>
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
                    onClick={() => {
                      setSelectedPlayer(player.name);
                    }}
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
            <button onClick={() => openModal('pom')} className={styles.pomButton}>
              Player of the Match
            </button>
            <button onClick={() => openModal('red')} className={styles.redCardButton}>
              레드카드
            </button>
            <button onClick={() => openModal('yellow')} className={styles.yellowCardButton}>
              옐로카드
            </button>
            <button onClick={handleGameEnd} className={styles.endGameButton}>
              경기 종료
            </button>
          </div>
        )}
      </div>
  
      {/* 공통 모달 */}
      {activeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>
              {activeModal === 'pom'
                ? 'Player of the Match'
                : activeModal === 'yellow'
                ? '옐로카드 부여'
                : '레드카드 부여'}
            </h2>
            <div className={styles.playerGrid}>
              {players.map((player) => (
                <button
                  key={player.id}
                  className={`${styles.playerButton} ${
                    (activeModal === 'pom' && pomPlayers.includes(player.name)) ||
                    (activeModal === 'yellow' && yellowCards.includes(player.name)) ||
                    (activeModal === 'red' && redCards.includes(player.name))
                      ? styles.selected
                      : ''
                  }`}
                  onClick={() => handleCardOrPOMSelection(player.name, activeModal)}
                >
                  {player.name}
                </button>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                저장
              </button>
              <button onClick={handleClose} className={styles.closeButton}>
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
