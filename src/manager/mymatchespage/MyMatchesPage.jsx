import React, { useState, useEffect } from "react";
import styles from "./MyMatchesPage.module.css";

const MyMatchesPage = () => {
    const [selectedDate, setSelectedDate] = useState(1);
    const [matchData, setMatchData] = useState({});
    const [loading, setLoading] = useState(true);

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
        setSelectedDate(date);
    };

    return (
        <div className={styles.container}>
            <div className={styles.calendarHeader}>
                <button className={styles.arrowButton}>{"<"}</button>
                <span className={styles.monthLabel}>2024년 12월</span>
                <button className={styles.arrowButton}>{">"}</button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.weekDays}>
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>

                <div className={styles.dates}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                        <span
                            key={date}
                            className={
                                date === selectedDate ? styles.selectedDate : ""
                            }
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
                    {matchData[selectedDate] && matchData[selectedDate].length > 0 ? (
                        matchData[selectedDate].map((match, index) => {
                            const [teamA, teamB] = match.match.split(" vs ");
                            const [scoreA, scoreB] = match.result.split(":").map(Number);

                            // 승리 팀 계산 로직
                            const winner =
                                scoreA > scoreB
                                    ? teamA
                                    : scoreA < scoreB
                                        ? teamB
                                        : "무승부";

                            return (
                                <div key={index} className={styles.match}>
                                    <p>경기: {match.match}</p>
                                    <p>결과: {match.result}</p>
                                    <p className={styles.status}>
                                        상태: {match.status}
                                    </p>
                                    <p className={styles.winner}>
                                        {winner === "무승부" ? "결과: 무승부" : `승리 팀: ${winner}`}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noMatches}>진행한 매치가 없어요.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyMatchesPage;
