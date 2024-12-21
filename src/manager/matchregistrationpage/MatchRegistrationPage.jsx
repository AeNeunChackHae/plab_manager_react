import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MatchRegistrationPage.module.css';

const matches = [
    { id: 1, teamA: 'Team A', teamB: 'Team B', scoreA: 3, scoreB: 2, date: '2024-12-01' },
    { id: 2, teamA: 'Team C', teamB: 'Team D', scoreA: 1, scoreB: 1, date: '2024-12-02' },
    { id: 3, teamA: 'Team E', teamB: 'Team F', scoreA: 2, scoreB: 2, date: '2024-12-03' },
    { id: 4, teamA: 'Team G', teamB: 'Team H', scoreA: 0, scoreB: 3, date: '2024-12-04' },
    { id: 5, teamA: 'Team I', teamB: 'Team J', scoreA: 1, scoreB: 0, date: '2024-12-05' },
    { id: 6, teamA: 'Team K', teamB: 'Team L', scoreA: 4, scoreB: 1, date: '2024-12-06' },
    { id: 7, teamA: 'Team M', teamB: 'Team N', scoreA: 3, scoreB: 3, date: '2024-12-07' },
    { id: 8, teamA: 'Team O', teamB: 'Team P', scoreA: 2, scoreB: 4, date: '2024-12-08' },
    { id: 9, teamA: 'Team Q', teamB: 'Team R', scoreA: 5, scoreB: 2, date: '2024-12-09' },
    { id: 10, teamA: 'Team S', teamB: 'Team T', scoreA: 0, scoreB: 0, date: '2024-12-10' }
];

const MatchRegistrationPage = () => {
    return (
        <div className={styles.container}>
            <h1>경기 결과 목록</h1>
            <ul className={styles.matchesList}>
                {matches.map(match => (
                    <li key={match.id}>
                        <Link to={`/match-detail/${match.id}`}>
                            {match.teamA} vs {match.teamB} - {match.scoreA}:{match.scoreB} ({match.date})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchRegistrationPage;
