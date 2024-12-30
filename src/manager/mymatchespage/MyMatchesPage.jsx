import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./MyMatchesPage.module.css";

const MyMatchesPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [matchData, setMatchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await fetch("/data/finished_matches.json");
                const data = await response.json();
                setMatchData(data.finished_matches);
            } catch (error) {
                console.error("Failed to load match data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatchData();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date));
    };

    const handleVideoUpload = () => {
        navigate('/video-upload');  // navigate 함수를 사용하여 리디렉션
    };

    const filteredMatches = matchData.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate.toDateString() === selectedDate.toDateString();
    });

    return (
        <div className={styles.container}>
            <div className={styles.calendarHeader}>
                <button className={styles.arrowButton}>{"<"}</button>
                <span className={styles.monthLabel}>{`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`}</span>
                <button className={styles.arrowButton}>{">"}</button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.weekDays}>
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>

                <div className={styles.dates}>
                    {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((date) => (
                        <span
                            key={date}
                            className={date === selectedDate.getDate() ? styles.selectedDate : ""}
                            onClick={() => handleDateClick(date)}
                        >
                            {date}
                        </span>
                    ))}
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className={styles.matchesContainer}>
                    {filteredMatches.length > 0 ? (
                        filteredMatches.map((match, index) => (
                            <div key={index} className={styles.match}>
                                <p>{match.type} | {match.date} {match.location} | {match.status}</p>
                                <p>Teams: {match.details.teamA} vs {match.details.teamB}</p>
                                <p>Time: {match.details.time}</p>
                                {match.status === "경기 완료" ? (
                                    <>
                                        <p>Score: {match.details.finalScore}</p>
                                        <p>Video: <a href={match.details.videoLink} target="_blank" rel="noopener noreferrer">Watch Here</a></p>
                                        <button onClick={handleVideoUpload}>영상 업로드</button>
                                    </>
                                ) : (
                                    <button>매치 관리</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noMatches}>선택한 날짜에 매치 정보가 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyMatchesPage;
