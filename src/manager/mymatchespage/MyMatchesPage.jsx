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
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("User ID not found in localStorage.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:9090/my-match/my", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                const groupedByDate = {};
                result.data.forEach((event) => {
                    const eventDate = getLocalDateString(event.start_time);
                    if (!groupedByDate[eventDate]) {
                        groupedByDate[eventDate] = [];
                    }
                    groupedByDate[eventDate].push({
                        id: event.match_id,
                        statusCode: event.status_code,
                        startTime: getTime24HourFormat(event.start_time),
                        endTime: getTime24HourFormat(event.end_time),
                        matchStartTime: new Date(event.start_time),
                        location: event.stadium_name,
                        region: REGION_MAP[event.region],
                        gender: event.gender === 0 ? "남자" : "여자",
                        level: LEVEL_MAP[event.level],
                        type: event.match_type === 1 ? "팀매치" : "소셜매치",
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

    const handleMatchClick = (match) => {
        const { statusCode, matchStartTime, id } = match;
        const now = new Date();

        if (statusCode === 0) {
            alert("마감된 매치가 아닙니다!");
            return;
        }

        const tenMinutesBeforeStart = new Date(matchStartTime);
        tenMinutesBeforeStart.setMinutes(matchStartTime.getMinutes() - 10);

        if (now < tenMinutesBeforeStart) {
            alert("아직 시작 전입니다!");
            return;
        }

        navigate("/player-numbers", { state: { matchId: id } });
    };

    const handleCancelClick = async (matchId) => {
        const confirmCancel = window.confirm("신청 취소하시겠습니까?");
        if (!confirmCancel) return;

        try {
            const response = await fetch("http://localhost:9090/my-match/cancel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ matchId }),
            });

            if (!response.ok) {
                throw new Error("취소 요청에 실패했습니다.");
            }

            alert("신청이 취소되었습니다!");
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) => ({
                    ...schedule,
                    schedules: schedule.schedules.filter((match) => match.id !== matchId),
                }))
            );
        } catch (err) {
            console.error(err);
            alert("취소 요청 처리 중 오류가 발생했습니다.");
        }
    };

    const handleMonthChange = (direction) => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const generateCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
    
        const lastDayPrevMonth = new Date(year, month, 0).getDate();
    
        // 이전 달의 마지막 일부터 추가
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                date: lastDayPrevMonth - i,
                isCurrentMonth: false,
            });
        }
    
        // 이번 달의 날짜 추가
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true,
            });
        }
    
        // 한 주를 채우기 위한 빈 날짜 추가
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
    const getMatchesForDate = (date) => {
        const matchData = schedules.find(
            (schedule) => schedule.date === getLocalDateString(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date))
        );
        return matchData ? matchData.schedules.length : 0;  // 매치가 있으면 그 수 반환
    };
    

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
    {calendarDays.map((day, index) => {
        const matchesCount = getMatchesForDate(day.date); // 해당 날짜의 매치 수를 확인
        return (
            <span
                key={index}
                className={`${day.isCurrentMonth ? (day.date === selectedDate.getDate() ? styles.selectedDate : "") : styles.otherMonth} ${matchesCount > 0 ? styles.hasMatch : ""}`}
                onClick={() => (day.isCurrentMonth ? handleDateClick(day.date) : null)}
                style={{
                    color: index % 7 === 0 ? "red" : index % 7 === 6 ? "blue" : "inherit",
                }}
            >
                {day.date}
            </span>
        );
    })}
</div>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <div className={styles.matchesContainer}>
                    {filteredMatches && filteredMatches.schedules.length > 0 ? (
                        filteredMatches.schedules.map((match, index) => {
                            const matchDate = new Date(match.matchStartTime);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            return (
                                <div
                                    key={index}
                                    className={styles.match}
                                    onClick={() => handleMatchClick(match)}
                                >
                                    <p>{`${match.type} | ${match.startTime} - ${match.endTime}`}</p>
                                    <p>{`${match.location} | ${match.region} | ${match.level}`}</p>
                                    {matchDate >= today && (
                                        <button
                                            className={styles.cancelButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelClick(match.id);
                                            }}
                                        >
                                            신청 취소
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noMatches}>선택한 날짜에 매치 정보가 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyMatchesPage;
