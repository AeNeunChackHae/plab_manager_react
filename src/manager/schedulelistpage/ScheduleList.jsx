import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ScheduleList.module.css';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [city, setCity] = useState('서울');
  const navigate = useNavigate();

  // Fetch schedules on component mount
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/data/schedules.json');
        setSchedules(response.data);
        setFilteredSchedules(response.data); // 초기에는 모든 경기를 표시
      } catch (err) {
        console.error('Failed to load schedule data:', err);
        setError('Failed to load schedule data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const toggleCityModal = () => {
    setIsCityModalOpen((prev) => !prev);
  };

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    setIsCityModalOpen(false);

    // 필터링된 일정만 설정
    const filtered = schedules.map((daySchedule) => ({
      ...daySchedule,
      schedules: daySchedule.schedules.filter(
        (schedule) => schedule.location === selectedCity
      ),
    })).filter((daySchedule) => daySchedule.schedules.length > 0);

    setFilteredSchedules(filtered);
  };

  const handleCardClick = (id) => {
    navigate(`/match-detail/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.scheduleContainer}>
      {/* 필터 버튼 */}
      <div className={styles.filterContainer}>
        <button onClick={toggleCityModal}>
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
            >
              {[
                '서울', '인천', '경기', '광주', '부산', '대전', '대구', '세종',
                '경북', '강원', '경남', '울산', '전북', '충북', '충남', '전남', '제주',
              ].map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <button onClick={toggleCityModal} className={styles.closeButton}>
              닫기
            </button>
          </div>
        </>
      )}

      {/* 일정 목록 */}
      {filteredSchedules.length > 0 ? (
        filteredSchedules.map((daySchedule, index) => (
          <div key={index} className={styles.daySection}>
            <h2 className={styles.dateTitle}>{daySchedule.date}</h2>
            <div className={styles.schedules}>
              {daySchedule.schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className={styles.scheduleCard}
                  onClick={() => handleCardClick(schedule.id)}
                >
                  <h4>{schedule.group}</h4>
                  <p>{schedule.time}</p>
                  <p>{schedule.location}</p>
                  <p>{schedule.teams.join(' vs ')}</p>
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
