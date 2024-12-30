import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeamManagementPage.module.css';

const teams = [
    { id: 1, name: 'red팀' },
    { id: 2, name: 'yellow팀' },
    { id: 3, name: 'blue팀' }
];

const players = [
    { id: 1, name: '김정은', teamId: 1 },
    { id: 2, name: '진덕규', teamId: 1 },
    { id: 3, name: '김정일', teamId: 1 },
    { id: 4, name: '진선규', teamId: 1 },
    { id: 5, name: '김일성', teamId: 1 },
    { id: 6, name: '진돗개', teamId: 1 }
];

const grades = [
    { value: 'A+', label: 'A+ (5점)' },
    { value: 'A', label: 'A (4.5점)' },
    { value: 'B+', label: 'B+ (4점)' },
    { value: 'B', label: 'B (3.5점)' },
    { value: 'C+', label: 'C+ (3점)' },
    { value: 'C', label: 'C (2.5점)' },
    { value: 'C0', label: 'C0 (2.5점)' }
];

const TeamManagementPage = () => {
    const [playerNumbers, setPlayerNumbers] = useState(new Array(players.length * 3).fill(''));
    const [playerGrades, setPlayerGrades] = useState(new Array(players.length * 3).fill(''));
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleNumberChange = (index, event) => {
        const updatedNumbers = [...playerNumbers];
        updatedNumbers[index] = event.target.value;
        setPlayerNumbers(updatedNumbers);
    };

    const handleGradeChange = (index, event) => {
        const updatedGrades = [...playerGrades];
        updatedGrades[index] = event.target.value;
        setPlayerGrades(updatedGrades);
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setSelectedPlayer(''); // 팀 변경 시 플레이어 선택 리셋
    };

    const handlePlayerChange = (event) => {
        setSelectedPlayer(event.target.value);
    };

    const handleComplete = () => {
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            navigate('/schedule-list');
        }, 5000);
    };

    const filteredPlayers = players.filter(player => player.teamId.toString() === selectedTeam);

    return (
        <div className={styles.container}>
            <div>
                <h2>개인 평가 기록</h2>
            </div>
            <div className={styles.teamSetup}>
                <img src="/assets/image/redVest.png" alt="Red Vest" className={styles.vest} />
                <img src="/assets/image/yellowVest.png" alt="Yellow Vest" className={styles.vest} />
                <img src="/assets/image/blueVest.png" alt="Blue Vest" className={styles.vest} />
                {['red', 'yellow', 'blue'].map((color, colorIndex) => (
                    <div key={color} className={styles.teamColumn}>
                        {players.map((player, index) => (
                            <div key={player.id} className={styles.playerSlot}>
                                <input
                                    type="text"
                                    value={playerNumbers[index + colorIndex * players.length]}
                                    onChange={(e) => handleNumberChange(index + colorIndex * players.length, e)}
                                    className={styles.numberInput}
                                    placeholder={`Player ${index + 1} Number`}
                                />
                                <select
                                    className={styles.gradeSelect}
                                    value={playerGrades[index + colorIndex * players.length]}
                                    onChange={(e) => handleGradeChange(index + colorIndex * players.length, e)}
                                >
                                    <option value="">점수 선택</option>
                                    {grades.map(grade => (
                                        <option key={grade.value} value={grade.value}>{grade.label}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.playerOfMatch}>
                <label>Player of the Match</label>
                <select className={styles.teamSelect} onChange={handleTeamChange}>
                    <option value="">팀 선택</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <select className={styles.playerSelect} onChange={handlePlayerChange}>
                    <option value="">이름 선택</option>
                    {filteredPlayers.map((player) => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                </select>
            </div>
            <button className={styles.completeButton} onClick={handleComplete}>완료</button>

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
};

export default TeamManagementPage;
