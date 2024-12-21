import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './MatchDetailPage.module.css';

const MatchDetailPage = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await axios.get(`/api/matches/${id}`);
                setMatch(response.data);
            } catch (err) {
                setError('매치 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatch();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!match) return <div>매치 정보가 없습니다.</div>;

    return (
        <div className={styles.container}>
            <h1>매치 상세</h1>
            <div className={styles.details}>
                <p><strong>날짜 및 시간:</strong> {match.date} {match.time}</p>
                <p><strong>상대 팀:</strong> {match.opponent}</p>
                <p><strong>장소:</strong> {match.location}</p>
                <p><strong>비용:</strong> {match.fee}</p>
            </div>
            <div className={styles.description}>
                <h2>경기 정보</h2>
                <p>{match.description}</p>
            </div>
        </div>
    );
};

export default MatchDetailPage;
