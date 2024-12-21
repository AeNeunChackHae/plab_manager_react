import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MatchResultPage.module.css';

const MatchResultPage = () => {
    const [teamAScore, setTeamAScore] = useState('');
    const [teamBScore, setTeamBScore] = useState('');
    const [result, setResult] = useState('');
    const location = useLocation();

    const handleScoreChange = (team, value) => {
        const score = parseInt(value) || '';
        if (team === 'A') {
            setTeamAScore(score);
        } else {
            setTeamBScore(score);
        }
        calculateResult();
    };

    const calculateResult = () => {
        if (teamAScore > teamBScore) {
            setResult('Team A wins');
        } else if (teamAScore < teamBScore) {
            setResult('Team B wins');
        } else {
            setResult('Draw');
        }
    };

    const handleSubmit = () => {
        alert(`Match Result: ${result}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabBar}>
                <Link to="/match-registration"
                    className={`${styles.tab} ${location.pathname === '/match-registration' ? 'active' : ''}`}>
                    경기
                </Link>
                <Link to="/match-results"
                    className={`${styles.tab} ${location.pathname === '/match-results' ? 'active' : ''}`}>
                    매치결과
                </Link>
            </div>
            <div className={styles.content}>
                <label>1팀 점수:</label>
                <input type="number" value={teamAScore} onChange={(e) => handleScoreChange('A', e.target.value)} />
                <label>2팀 점수:</label>
                <input type="number" value={teamBScore} onChange={(e) => handleScoreChange('B', e.target.value)} />
                <div>결과: {result}</div>
                <button onClick={handleSubmit}>경기결과 저장</button>
            </div>
        </div>
    );
};

export default MatchResultPage;
