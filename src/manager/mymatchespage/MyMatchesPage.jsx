import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyMatchesPage.module.css";

// 날짜 유틸리티 함수
const getLocalDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getTime24HourFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

// 지역, 레벨 매핑
const REGION_MAP = { 0: "서울", 1: "부산", 2: "대구" };
const LEVEL_MAP = { 0: "모든 레벨", 1: "아마추어1 이하", 2: "아마추어2 이상" };

const MyMatchesPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            const userId = localStorage.getItem("userId"); // 로컬에서 유저 ID 가져오기
            if (!userId) {
                setError("User ID not found in localStorage.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:9090/manager/my-matches", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }), // 유저 ID 포함
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // 날짜별 데이터 그룹화
                const groupedByDate = {};
                result.data.forEach((event) => {
                    const eventDate = getLocalDateString(event.start_time);
                    if (!groupedByDate[eventDate]) {
                        groupedByDate[eventDate] = [];
                    }
                    groupedByDate[eventDate].push({
                        id: event.match_id,
                        type: event.match_type === 1 ? "팀매치" : "소셜매치",
                        startTime: getTime24HourFormat(event.start_time),
                        endTime: getTime24HourFormat(event.end_time),
                        location: event.stadium_name,
                        region: REGION_MAP[event.region],
                        gender: event.gender === 0 ? "남자" : "여자",
                        level: LEVEL_MAP[event.level],
                    });
                });

                const transformedData = Object.entries(groupedByDate).map(([date, schedules]) => ({
                    date,
                    schedules,
                }));

                setSchedules(transformedData);
            } catch (err) {
                console.error("Failed to load schedule data:", err);
                setError("Failed to load schedule data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date));
    };

    const handleMonthChange = (direction) => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const handleMatchClick = (matchId) => {
        navigate("/player-numbers", { state: { matchId } }); // match_id를 state로 전달
    };

    const generateCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 1일의 요일
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // 이전 달 마지막 날짜 계산
        const lastDayPrevMonth = new Date(year, month, 0).getDate();

        // 첫 주의 빈 공간 채우기
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                date: lastDayPrevMonth - i,
                isCurrentMonth: false,
            });
        }

        // 이번 달 날짜 추가
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true,
            });
        }

        // 다음 달 날짜 추가
        while (days.length % 7 !== 0) {
            days.push({
                date: days.length - daysInMonth - firstDay + 1,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const calendarDays = generateCalendar();
    const filteredMatches = schedules.find(
        (schedule) => schedule.date === getLocalDateString(selectedDate)
    );

    return (
        <div className={styles.container}>
            <div className={styles.calendarHeader}>
                <button className={styles.arrowButton} onClick={() => handleMonthChange(-1)}>
                    {"<"}
                </button>
                <span className={styles.monthLabel}>
                    {`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`}
                </span>
                <button className={styles.arrowButton} onClick={() => handleMonthChange(1)}>
                    {">"}
                </button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.weekDays}>
                    {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                        <span
                            key={day}
                            style={{
                                color: index === 0 ? "red" : index === 6 ? "blue" : "inherit",
                            }}
                        >
                            {day}
                        </span>
                    ))}
                </div>

                <div className={styles.dates}>
                    {calendarDays.map((day, index) => (
                        <span
                            key={index}
                            className={
                                day.isCurrentMonth
                                    ? day.date === selectedDate.getDate()
                                        ? styles.selectedDate
                                        : ""
                                    : styles.otherMonth
                            }
                            onClick={() =>
                                day.isCurrentMonth ? handleDateClick(day.date) : null
                            }
                            style={{
                                color: index % 7 === 0 ? "red" : index % 7 === 6 ? "blue" : "inherit",
                            }}
                        >
                            {day.date}
                        </span>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <div className={styles.matchesContainer}>
                    {filteredMatches && filteredMatches.schedules.length > 0 ? (
                        filteredMatches.schedules.map((match, index) => (
                            <div
                                key={index}
                                className={styles.match}
                                onClick={() => handleMatchClick(match.id)} // match_id 전달
                            >
                                <p>{`${match.type} | ${match.startTime} - ${match.endTime}`}</p>
                                <p>{`${match.location} | ${match.region} | ${match.level}`}</p>
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
