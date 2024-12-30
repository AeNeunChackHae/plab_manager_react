import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './VideoUploadPage.module.css'

const VideoUploadPage = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('/data/getlogo.json');
                console.log(response.data); // 응답 데이터 확인
                setMatches(response.data.matches);
            } catch (error) {
                console.error('패치 실패패:', error);
            }
        };
        fetchMatches();
    }, []);
    

      return (
        <div className={styles.container}>
            <div className={styles.tabBar}>
                <h1 className={styles.tab}>경기 영상 업로드</h1>
            </div>
                <div className={styles.matchList}>
                    {matches.map((match, index) => (
                    <div key={index} className={styles.matchItem}>
                        {/* 왼쪽 팀 로고와 이름 */}
                        <div className={styles.team}>
                            <img
                                src={match.teamALogo}
                                alt={`${match.teamA} 로고`}
                                className={styles.teamLogo}
                            />
                            <span className={styles.teamName}>{match.teamA}</span>
                        </div>

                        {/* 스코어 */}
                        <div className={styles.score}>
                            <div>{match.score}</div>
                        </div>

                        {/* 오른쪽 팀 이름과 로고 */}
                        <div className={styles.teamReverse}>
                            <span className={styles.teamName}>{match.teamB}</span>
                            <img
                                src={match.teamBLogo}
                                alt={`${match.teamB} 로고`}
                                className={styles.teamLogo}
                            />
                        </div>

                        {/* 조건부 렌더링 */}
                        <div className={styles.rightBlock}>
                            {match.videoUrl ? (
                                <>
                                    {/* 플레이 버튼 */}
                                    <a
                                        href={match.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.videoButton}
                                    >
                                        <img
                                            src="/assets/image/play.png"
                                            alt="play"
                                            className={styles.icon}
                                        />
                                    </a>
                                    {/* 다운로드 버튼 */}
                                    <a
                                        href={match.videoUrl}
                                        download
                                        className={styles.downloadButton}
                                    >
                                        <img
                                            src="/assets/image/download.png"
                                            alt="download"
                                            className={styles.icon}
                                        />
                                    </a>
                                </>
                            ) : (
                                <>
                                    {/* 업로드 버튼 */}
                                    <Link
                                        to={`/upload/${match.id}`}
                                        className={styles.uploadButton}
                                    >
                                        영상 업로드
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoUploadPage;
