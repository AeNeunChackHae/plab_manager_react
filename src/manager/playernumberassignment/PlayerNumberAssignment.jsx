import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../playernumberassignment/PlayerNumberAssignment.module.css';

const PlayerNumberAssignment = () => {
  const location = useLocation();
  const { matchId } = location.state || {}; // 전달된 match_id 가져오기
  const navigate = useNavigate(); // useNavigate 사용

  // 상태 관리
  const [players, setPlayers] = useState([]); // 서버에서 가져온 데이터를 담을 상태
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
  const [activePlayerModal, setActivePlayerModal] = useState(null);
  const [savedPomPlayers, setSavedPomPlayers] = useState([]);
  const [savedYellowCards, setSavedYellowCards] = useState([]);
  const [savedRedCards, setSavedRedCards] = useState([]);
  const [savedLevels, setSavedLevels] = useState([]);
  const [pomPlayers, setPomPlayers] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [redCards, setRedCards] = useState([]);
  // 서버에서 players 데이터를 가져오기 (POST /api/match/players)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:9090/match/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ matchId }),
        });
  
        if (response.ok) {
          const data = await response.json();
          // console.log('back에서 받아온 데이터: ', data);
          
          // 데이터 매핑: 백엔드 데이터의 username과 level_code를 반영
          const playersWithMercenary = [
            { id: 0, username: '용병', level_code: null },
            ...data.map(player => ({
              id: player.id,
              username: player.username,
              level_code: player.level_code
            }))
          ];
  
          setPlayers(playersWithMercenary);
          console.log('서버에서 플레이어스 데이터 가져옴')
          // console.log('playersWithMercenary 가져와서 가공된 값값',playersWithMercenary)
        } else {
          throw new Error('플레이어 목록 가져오기 실패');
        }
      } catch (error) {
        console.error('플레이어 데이터 가져오기 오류:', error);
        alert('플레이어 목록을 가져오는 중 오류가 발생했습니다.');
      }
    };
  
    if (matchId) fetchPlayers();
  }, [matchId]);

  const handleGameEnd = async () => {
    try {
      // 데이터 수집
      const cardsToSave = [
        ...savedPomPlayers.map((player) => ({
          userId: player.id,
          cardType: 3, // POM
          descriptionCode: 3,
        })),
        ...savedRedCards.map((player) => ({
          userId: player.id,
          cardType: 1, // 레드카드
          descriptionCode: 0,
        })),
        ...savedYellowCards.map((player) => ({
          userId: player.id,
          cardType: 0, // 옐로카드
          descriptionCode: 1,
        })),
        ...absentPlayers.map((player) => ({
          userId: player.id,
          cardType: 1, // 불참
          descriptionCode: 0,
        }))

      ].filter(card => card !== null);  // null 값을 제거
      console.log('cardsToSave',cardsToSave)

      const absentPlayersToUpdate = absentPlayers.map((player) => ({
        match_id: matchId,
        user_id: player.id,
        status_code: 2, // 불참 상태 코드
      }));

      const playersToSave = [];
      Object.keys(teamSlots).forEach((teamName, teamIndex) => {
        teamSlots[teamName].forEach((slot, slotIndex) => {
          if (slot.player && slot.player.id !== 0) { // 용병 제외
            playersToSave.push({
              match_id: matchId,
              user_id: slot.player.id,
              user_team: teamIndex, // 0: 빨강, 1: 노랑, 2: 파랑
              user_number: slotIndex  // 슬롯 번호 (1부터 시작)
            });
          }
        });
      });
      console.log('저장할 선수 데이터:', playersToSave);
      console.log('불참 처리할 유저:', absentPlayersToUpdate);

      const positionsResponse = await fetch('http://localhost:9090/match/update-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          matchId, 
          players: playersToSave, 
          absentPlayers: absentPlayersToUpdate, // 불참 유저 추가
        }),
      });

      if (!positionsResponse.ok) {
        throw new Error('선수 포지션 저장 실패');
      }
  
      // 레벨 업데이트 요청
      const levelUpdateResponse = await fetch('http://localhost:9090/match/update-levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          players: players.filter(player => player.id !== 0).map(player => ({
            userId: player.id,
            level: player.level_code,
          })),
        }),
      });
      console.log('레벨 업데이트 요청')
  
      if (!levelUpdateResponse.ok) {
        throw new Error('레벨 업데이트 실패');
      }
  
      // 레벨 업데이트가 완료되었으면 카드 저장 요청
      const response = await fetch('http://localhost:9090/match/save-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ matchId, cards: cardsToSave }),
      });
  
      if (response.ok) {
        alert('경기 데이터가 성공적으로 저장되었습니다.');
        resetGameState(); // 상태 초기화
        navigate('/schedule-list');
      } else {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error('경기 데이터 저장 실패');
      }
      console.log('레벨 업데이트 요청 후, 카드 저장 요청')
    } catch (error) {
      console.error('경기 데이터 저장 오류:', error);
      alert('경기 데이터 저장 중 오류가 발생했습니다.');
    }
  };
  
  
  
  // 드롭다운 토글
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  // 슬롯 업데이트
  const updateTeamSlots = (team, slotIndex, playerData) => {
    const updatedSlots = [...teamSlots[team]];
    updatedSlots[slotIndex] = playerData;
    setTeamSlots({ ...teamSlots, [team]: updatedSlots });
    console.log('슬롯 업데이트')
  };
  // console.log('players',players)

  // 슬롯에 플레이어 배정 또는 제거
  const assignPlayerToSlot = (team, slotIndex) => {
    const selectedSlot = teamSlots[team][slotIndex];
  
    if (selectedSlot.player) {
      const confirmRemove = window.confirm(
        `${selectedSlot.player.username} 선수를 슬롯에서 제거하시겠습니까?`
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
  
    // 불참 인원인 경우
    if (selectedPlayer.username !== '용병' && absentPlayers.includes(selectedPlayer)) {
      alert('불참 인원은 슬롯에 넣을 수 없습니다.');
      setSelectedPlayer('');
      return;
    }
  
    // 이미 다른 슬롯에 배정된 경우
    if (
      selectedPlayer.username !== '용병' &&
      Object.values(teamSlots).some((team) =>
        team.some((slot) => slot.player === selectedPlayer)
      )
    ) {
      alert('이 선수는 이미 다른 슬롯에 배정되었습니다.');
      return;
    }
  
    updateTeamSlots(team, slotIndex, { player: selectedPlayer, card: [] });
    setSelectedPlayer('');
    console.log('슬롯 플레이어 배정')
  };
  
  

  // 불참 처리
  const markPlayerAbsent = () => {
    if (!selectedPlayer) {
      alert('선수를 선택해주세요!');
      return;
    }
  
    // 불참 상태 확인
    const isAlreadyAbsent = absentPlayers.some((player) => player.id === selectedPlayer.id);
  
    if (isAlreadyAbsent) {
      // 불참 취소 처리
      const confirmCancel = window.confirm(`${selectedPlayer.username}의 불참 상태를 취소하시겠습니까?`);
      if (confirmCancel) {
        setAbsentPlayers((prev) => prev.filter((player) => player.id !== selectedPlayer.id));
        alert(`${selectedPlayer.username}의 불참 상태가 취소되었습니다.`);
      }
    } else {
      // 새로운 불참 처리
      setAbsentPlayers((prev) => [...prev, selectedPlayer]);
  
      // 팀 슬롯에서 불참 인원 제거
      const updatedTeamSlots = { ...teamSlots };
      Object.keys(updatedTeamSlots).forEach((team) => {
        updatedTeamSlots[team] = updatedTeamSlots[team].map((slot) =>
          slot.player && slot.player.id === selectedPlayer.id
            ? { player: null, card: [] } // 불참 인원을 제거
            : slot
        );
      });
  
      setTeamSlots(updatedTeamSlots);
      alert(`${selectedPlayer.username}이(가) 불참으로 지정되었습니다.`);
    }
    // console.log('불참처리')
    // 선수 선택 초기화
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
  
  const handleSave = (type) => {
    if (type === 'pom') {
      // console.log('Saving POM Players:', pomPlayers);
      setSavedPomPlayers([...pomPlayers]);
    } else if (type === 'yellow') {
      // console.log('Saving Yellow Cards:', yellowCards);
      setSavedYellowCards([...yellowCards]);
    } else if (type === 'red') {
      // console.log('Saving Red Cards:', redCards);
      setSavedRedCards([...redCards]);
    }
    alert(`${type} 저장되었습니다.`);
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

    // console.log(`${type} currentList:`, currentList);
  };

  
  const [teamAverages, setTeamAverages] = useState({
    red: 0,
    yellow: 0,
    blue: 0,
  });
  
  const distributePlayersToBalancedTeams = () => {
    // 불참 유저 제외
    const availablePlayers = [...players].filter(
      (player) => player.id !== 0 && !absentPlayers.some((absentPlayer) => absentPlayer.id === player.id)
    );
  
    // 팀 초기화
    const teams = { red: [], yellow: [], blue: [] };
  
    try {
      // 레벨 높은 순으로 정렬
      availablePlayers.sort((a, b) => b.level_code - a.level_code);
  
      // 균형 있는 팀 분배
      availablePlayers.forEach((player) => {
        // 현재 가장 적은 인원을 가진 팀 선택
        const teamWithLeastPlayers = Object.keys(teams).reduce((leastTeam, currentTeam) =>
          teams[leastTeam].length <= teams[currentTeam].length ? leastTeam : currentTeam
        );
  
        // 해당 팀에 추가 (6명 초과하지 않도록 제한)
        if (teams[teamWithLeastPlayers].length < 6) {
          teams[teamWithLeastPlayers].push({ player, card: [] });
        }
      });
  
      // 빈 슬롯에 용병 추가 (각 팀이 6명이 되도록 보완)
      Object.keys(teams).forEach((teamName) => {
        while (teams[teamName].length < 6) {
          teams[teamName].push({ player: { id: 0, username: "용병", level_code: 0 }, card: [] });
        }
      });
  
      // 팀 평균 레벨 계산
      const calculateAverage = (team) =>
        team.length > 0
          ? Math.round(
              team.reduce((sum, slot) => sum + (slot.player.level_code || 0), 0) / team.length
            )
          : 0;
  
    const newTeamAverages = {
      red: calculateAverage(teams.red),
      yellow: calculateAverage(teams.yellow),
      blue: calculateAverage(teams.blue),
    };

    setTeamAverages(newTeamAverages);

    // 팀 슬롯 업데이트
    setTeamSlots({
      red: teams.red,
      yellow: teams.yellow,
      blue: teams.blue,
    });

  } catch (error) {
    console.error("팀 분배 오류:", error);
    alert("팀 분배에 실패했습니다. 남은 인원을 확인하고 다시 시도하세요.");
  }
};

// 슬롯 클릭 시 모달 열기
const handleSlotClick = (team, slotIndex) => {
  const slot = teamSlots[team][slotIndex];
  if (slot.player) {
    setActivePlayerModal(slot.player);
  } else {
    alert('이 슬롯에는 플레이어가 없습니다.');
  }
};

// 레벨 조정 함수
const handleLevelChange = (levelChange) => {
  if (!activePlayerModal) return;  // activePlayerModal이 존재할 때만

  const newLevel = activePlayerModal.level_code + levelChange;

  if (newLevel < 0) {
    alert('레벨은 0 이하로 설정할 수 없습니다.');
    return;
  }

  // activePlayerModal의 레벨을 업데이트
  setActivePlayerModal((prev) => ({
    ...prev,
    level_code: newLevel, // 레벨 변경
  }));

  // players 상태에서도 해당 선수를 업데이트
  setPlayers((prevPlayers) =>
    prevPlayers.map((player) =>
      player.id === activePlayerModal.id
        ? { ...player, level_code: newLevel } // 해당 선수의 레벨 실시간으로 업데이트
        : player
    )
  );
};

// 저장된 레벨 저장 함수
const handleSaveLevel = () => {
  if (activePlayerModal) {
    // players 상태에서 해당 선수를 업데이트
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === activePlayerModal.id
          ? { ...player, level_code: activePlayerModal.level_code } // 레벨 업데이트
          : player
      )
    );

    // 레벨 저장
    setSavedLevels((prev) => [
      ...prev.filter((level) => level.userId !== activePlayerModal.id), // 같은 선수가 있을 경우 덮어쓰기
      { userId: activePlayerModal.id, level: activePlayerModal.level_code }, // 레벨 저장
    ]);

    // level 변경 후, activePlayerModal을 갱신하여 UI에 즉시 반영
    setActivePlayerModal((prev) => ({
      ...prev,
      level_code: activePlayerModal.level_code, // 레벨 업데이트
    }));

    alert(`${activePlayerModal.username}의 레벨이 저장되었습니다.`);
    setActivePlayerModal(null); // 모달 닫기
  }
};



// 모달 닫기
const closePlayerModal = () => {
  setActivePlayerModal(null);
};

  // 게임 시작 및 종료
const handleGameStart = () => {
  distributePlayersToBalancedTeams(); // 팀 배치 실행

  // 모든 팀이 정확히 6명인지 확인
  const isValidTeamSetup = Object.values(teamSlots).every(
    (team) => team.length === 6 && team.every((slot) => slot.player !== null)
  );

  if (!isValidTeamSetup) {
    alert('팀에 6명이 정확히 배치되지 않았습니다. 팀 구성을 확인해주세요.');
    return;
  }

  setIsGameStarted(true);
  alert('경기가 시작되었습니다!');
};

const resetGameState = () => {
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
};

return (
  <div className={styles.appContainer}>
    <div className={`${styles.layout} ${isGameStarted ? styles.centeredLayout : ''}`}>
      {/* 왼쪽 선수 선택 영역 */}
      <div className={`${styles.leftContainer} ${isGameStarted ? styles.hidden : ''}`}>
        <div className={styles.dropdownWrapper} onClick={(e) => e.stopPropagation()}>
          <div className={styles.distributeButton}>
            <button onClick={distributePlayersToBalancedTeams} className={styles.teambutton}>
              팀 배치
            </button>
            <button onClick={resetGameState} className={styles.teambutton}>
              초기화
            </button>
          </div>
          <button className={styles.dropdownToggle} onClick={toggleDropdown}>
            {selectedPlayer.username || '선수 선택'}
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`${styles.dropdownItem} ${
                    absentPlayers.some((absentPlayer) => absentPlayer.id === player.id)
                      ? styles.absent
                      : ''
                  }`}
                  onClick={() => {
                    if (absentPlayers.some((absentPlayer) => absentPlayer.id === player.id)) {
                      alert(`${player.username}은/는 불참 상태로 설정되어 있습니다.`);
                      return;
                    }
                    setSelectedPlayer(player);
                    closeDropdown();
                  }}
                >
                  {player.username}{' '}
                  {absentPlayers.some((absentPlayer) => absentPlayer.id === player.id) && '(불참)'}
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
                    onClick={
                      isGameStarted
                        ? () => handleSlotClick(team, index) // 경기 시작 후: 모달 열기
                        : () => assignPlayerToSlot(team, index) // 경기 시작 전: 선수 배치
                    }
                  >
                    {slot.player ? slot.player.username : `#${index + 1}`} 
                  </div>
                ))}
              </div>
              {/* 팀 이름과 평균값 */}
              <div className={styles.teamAverage}>
                {team.toUpperCase()} 팀<br/>
                {`평균 레벨: ${teamAverages[team] !== 0 ? teamAverages[team].toFixed(1) : "계산 중"}`}
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
        {/* 레벨 조정 모달 */}
        {activePlayerModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>플레이어 정보</h2>
      <div>
        <p>이름: {activePlayerModal.username}</p>
        <p>레벨: {activePlayerModal.level_code}</p> {/* 레벨 실시간 반영 */}
      </div>
      <div className={styles.levelControls}>
        <button
          className={styles.levelButton}
          onClick={() => handleLevelChange(-1)}  // 레벨 감소
        >
          -
        </button>
        <span className={styles.levelDisplay}>
          {activePlayerModal.level_code}  {/* 실시간으로 변경된 레벨 표시 */}
        </span>
        <button
          className={styles.levelButton}
          onClick={() => handleLevelChange(1)}  // 레벨 증가
        >
          +
        </button>
      </div>
      <button className={styles.saveButton} onClick={handleSaveLevel}>저장</button>
      <button className={styles.closeButton} onClick={closePlayerModal}>닫기</button>
    </div>
  </div>
)}



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
        {/* 용병과 불참 유저 제외 */}
        {players
          .filter(
            (player) =>
              player.id !== 0 && // 용병 제외
              !absentPlayers.some((absentPlayer) => absentPlayer.id === player.id) // 불참 유저 제외
          )
          .map((player) => (
            <button
              key={player.id}
              className={`${styles.playerButton} ${
                (activeModal === 'pom' && pomPlayers.some((p) => p.id === player.id)) ||
                (activeModal === 'yellow' && yellowCards.some((p) => p.id === player.id)) ||
                (activeModal === 'red' && redCards.some((p) => p.id === player.id))
                  ? styles.selected
                  : ''
              }`}
              onClick={() => handleCardOrPOMSelection(player, activeModal)}
            >
              {player.username}
            </button>
          ))}
      </div>
          <div className={styles.modalActions}>
            <button onClick={() => handleSave(activeModal)} className={styles.saveButton}>
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
