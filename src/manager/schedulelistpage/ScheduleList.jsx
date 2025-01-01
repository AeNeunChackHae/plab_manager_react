import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ScheduleList.module.css';

// 날짜를 "월 일 요일" 형태로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'long' });
  return `${month}월 ${day}일 ${dayOfWeek}`;
};

// 로컬 시간대에 맞는 YYYY-MM-DD 문자열 반환 함수
const getLocalDateString = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 24시간 형식으로 시간 변환
const getTime24HourFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// 지역 코드 매핑
const REGION_MAP = {
  0: '서울', 1: '부산', 2: '대구', 3: '인천', 4: '광주',
  5: '대전', 6: '울산', 7: '세종', 8: '경기', 9: '강원',
  10: '충북', 11: '충남', 12: '전북', 13: '전남', 14: '경북',
  15: '경남', 16: '제주'
};

// Level 코드 매핑
const LEVEL_MAP = {
  0: '모든 레벨',
  1: '아마추어1 이하',
  2: '아마추어2 이상'
};

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]); // 전체 일정 데이터
  const [filteredSchedules, setFilteredSchedules] = useState([]); // 필터링된 일정 데이터
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(''); // 에러 상태
  const [isCityModalOpen, setIsCityModalOpen] = useState(false); // 지역 선택 모달 상태
  const [city, setCity] = useState('서울'); // 선택된 지역 기본값: 서울
  const navigate = useNavigate();

  // 유저 인증 확인
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('정보가 유효하지 않습니다. 다시 로그인해주세요!');
      navigate('/'); // 로그인 페이지로 이동
      return;
    }
  }, [navigate]);

  // 백엔드에서 일정 데이터 가져오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('http://localhost:9090/schedule-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // 날짜별로 그룹화 (로컬 시간대 기준)
        const groupedByDate = {};
        result.data.forEach(event => {
          const eventDate = getLocalDateString(event.start_time);
          if (!groupedByDate[eventDate]) {
            groupedByDate[eventDate] = [];
          }
          groupedByDate[eventDate].push({
            id: event.match_id,
            type: event.match_type === 1 ? '팀매치' : '소셜매치',
            startTime: getTime24HourFormat(event.start_time),
            endTime: getTime24HourFormat(event.end_time),
            location: event.stadium_name,
            region: REGION_MAP[event.region],
            gender: event.gender === 0 ? '남자' : '여자',
            level: LEVEL_MAP[event.level],
            address: event.address
          });
        });

        const transformedData = Object.entries(groupedByDate).map(([date, schedules]) => ({
          date,
          schedules
        }));

        setSchedules(transformedData);

        // 초기에는 '서울' 지역으로 필터링
        const initialFiltered = transformedData.map((daySchedule) => ({
          ...daySchedule,
          schedules: daySchedule.schedules.filter(
            (schedule) => schedule.region === '서울'
          ),
        })).filter((daySchedule) => daySchedule.schedules.length > 0);

        setFilteredSchedules(initialFiltered);
      } catch (err) {
        console.error('Failed to load schedule data:', err);
        setError('Failed to load schedule data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // 지역 필터링
  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    setIsCityModalOpen(false);

    const filtered = schedules.map((daySchedule) => ({
      ...daySchedule,
      schedules: daySchedule.schedules.filter(
        (schedule) => schedule.region === selectedCity
      ),
    })).filter((daySchedule) => daySchedule.schedules.length > 0);

    setFilteredSchedules(filtered);
  };

  const toggleCityModal = () => {
    setIsCityModalOpen((prev) => !prev);
  };

  const handleCardClick = (id) => {
    // match_id를 사용해 상세 페이지로 이동
    navigate(`/match-detail/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.scheduleContainer}>
      {/* 필터 모달 버튼 */}
      <div className={styles.filterContainer}>
        <button
          onClick={toggleCityModal}
          className={styles.filterButton}
        >
          {city} <span>▼</span>
        </button>
      </div>

      {/* 모달 */}
      {isCityModalOpen && (
        <>
          <div className={styles.overlay} onClick={toggleCityModal}></div>
          <div className={styles.modal}>
            <h2>지역 선택</h2>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className={styles.regionList}
            >
              {Object.values(REGION_MAP).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <br />
            <button onClick={toggleCityModal} className={styles.closeButton}>
              X
            </button>
          </div>
        </>
      )}

      {/* 일정 목록 */}
      {filteredSchedules.length > 0 ? (
        filteredSchedules.map((daySchedule, index) => (
          <div key={index} className={styles.daySection}>
            <h2 className={styles.dateTitle}>{formatDate(daySchedule.date)}</h2>
            <div className={styles.schedules}>
              {daySchedule.schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className={styles.scheduleCard}
                  onClick={() => handleCardClick(schedule.id)}
                >
                  <p className={styles.matchLocation}>{schedule.location}</p>
                  <p className={styles.matchDetails}>
                    {schedule.type} · {schedule.gender} · {schedule.level}
                  </p>
                  <div className={styles.matchTime}>
                    <p>시작 시간: {schedule.startTime}</p>
                    <p>종료 시간: {schedule.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noSchedule}>선택한 지역에 경기가 없습니다.</div>
      )}
    </div>
  );
};

export default ScheduleList;
