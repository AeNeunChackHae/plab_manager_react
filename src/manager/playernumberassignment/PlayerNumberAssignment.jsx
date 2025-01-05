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
  const [savedPomPlayers, setSavedPomPlayers] = useState([]);
  const [savedYellowCards, setSavedYellowCards] = useState([]);
  const [savedRedCards, setSavedRedCards] = useState([]);
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

  // 서버로 카드 데이터 저장
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
        })),
      ];
  
      // 디버깅 로그 추가
      // console.log('cardsToSave:', cardsToSave);
      // console.log('POM Players:', savedPomPlayers);
      // console.log('Red Cards:', savedRedCards);
      // console.log('Yellow Cards:', savedYellowCards);
      // console.log('Absent Players:', absentPlayers);
  
      // 서버 요청
      const response = await fetch('http://localhost:9090/match/save-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ matchId, cards: cardsToSave }),
      });
  
      // 서버 응답 확인
      if (response.ok) {
        alert('경기 데이터가 성공적으로 저장되었습니다.');
        resetGameState(); // 상태 초기화
        navigate('/schedule-list');
      } else {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error('경기 데이터 저장 실패');
      }
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
  };
  // console.log('players',players)

  // 플레이어의 레벨을 조정하는 함수
const adjustPlayerLevel = async (userId, levelChange) => {
  try {
    // 서버로 요청 보내기
    const response = await fetch('http://localhost:9090/match/level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, levelChange }),
    });

    if (response.ok) {
      const updatedPlayer = await response.json();
      // 성공적으로 업데이트된 데이터를 반영
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === userId ? { ...player, level_code: updatedPlayer.level_code } : player
        )
      );
      alert(`${updatedPlayer.username}의 레벨이 ${updatedPlayer.level_code}로 업데이트되었습니다.`);
    } else {
      throw new Error('레벨 조정 실패');
    }
  } catch (error) {
    console.error('레벨 조정 오류:', error);
    alert('레벨 조정 중 문제가 발생했습니다.');
  }
};


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
                    onClick={() => assignPlayerToSlot(team, index)}
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
            {/* 용병 제외 */}
            {players
              .filter((player) => player.id !== 0) // 용병 제외 조건
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
