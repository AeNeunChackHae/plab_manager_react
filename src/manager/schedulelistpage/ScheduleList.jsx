import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ScheduleList.module.css';
import Modal from '../../modal/Modal';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isMatchTypeModalOpen, setIsMatchTypeModalOpen] = useState(false);
    const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

    // 필터 상태
    const [city, setCity] = useState('서울');
    const [day, setDay] = useState('요일');
    const [time, setTime] = useState('시간');
    const [matchType, setMatchType] = useState('매치타입');
    const [gender, setGender] = useState('성별');

    const navigate = useNavigate();

    const toggleCityModal = () => setIsCityModalOpen(!isCityModalOpen);
    const toggleDayModal = () => setIsDayModalOpen(!isDayModalOpen);
    const toggleTimeModal = () => setIsTimeModalOpen(!isTimeModalOpen);
    const toggleMatchTypeModal = () => setIsMatchTypeModalOpen(!isMatchTypeModalOpen);
    const toggleGenderModal = () => setIsGenderModalOpen(!isGenderModalOpen);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/data/schedules.json');
                setSchedules(response.data);
            } catch (error) {
                console.error('Failed to load schedule data:', error);
                setError('Failed to load schedule data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/match-detail/${id}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className={styles.scheduleContainer}>
                <div className={styles.filterContainer}>
                    <button onClick={toggleCityModal}>지역</button>
                    <button onClick={toggleDayModal}>요일</button>
                    <button onClick={toggleTimeModal}>시간</button>
                    <button onClick={toggleMatchTypeModal}>매치타입</button>
                    <button onClick={toggleGenderModal}>성별</button>
                </div>

                {schedules.map((daySchedule, index) => (
                    <div key={index} className={styles.daySection}>
                        <h2 className={styles.dateTitle}>{daySchedule.date}</h2>
                        <div className={styles.schedules}>
                            {daySchedule.schedules.map((schedule, idx) => (
                                <div key={idx} className={styles.scheduleCard} onClick={() => handleCardClick(schedule.id)}>
                                    <h4>{schedule.group}</h4>
                                    <p>{schedule.time}</p>
                                    <p>{schedule.location}</p>
                                    <p>{schedule.teams.join(' vs ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {/* Modal Components */}
                <Modal isOpen={isCityModalOpen} title="지역" closeModal={toggleCityModal}>
                    <select value={city} onChange={(e) => { setCity(e.target.value); toggleCityModal(); }}>
                        <option value="서울">서울</option>
                        <option value="인천">인천</option>
                        <option value="경기">경기</option>
                        <option value="광주">광주</option>
                        <option value="부산">부산</option>
                        <option value="대전">대전</option>
                        <option value="대구">대구</option>
                        <option value="세종">세종</option>
                        <option value="경북">경북</option>
                        <option value="강원">강원</option>
                        <option value="경남">경남</option>
                        <option value="울산">울산</option>
                        <option value="전북">전북</option>
                        <option value="충북">충북</option>
                        <option value="충남">충남</option>
                        <option value="전남">전남</option>
                        <option value="제주">제주</option>
                    </select>
                </Modal>
                <Modal isOpen={isDayModalOpen} title="요일" closeModal={toggleDayModal}>
                    <select value={day} onChange={(e) => { setDay(e.target.value); toggleDayModal(); }}>
                        <option value="월요일">월요일</option>
                        <option value="화요일">화요일</option>
                        <option value="수요일">수요일</option>
                        <option value="목요일">목요일</option>
                        <option value="금요일">금요일</option>
                        <option value="토요일">토요일</option>
                        <option value="일요일">일요일</option>
                    </select>
                </Modal>
                <Modal isOpen={isTimeModalOpen} title="시간" closeModal={toggleTimeModal}>
                    <select value={time} onChange={(e) => { setTime(e.target.value); toggleTimeModal(); }}>
                        {Array.from({ length: 10 }, (_, i) => 6 + 2 * i).map(hour => (
                            <option key={hour} value={`${hour}:00 - ${hour + 2}:00`}>
                                {`${hour}:00 - ${hour + 2}:00`}
                            </option>
                        ))}
                    </select>
                </Modal>
                <Modal isOpen={isMatchTypeModalOpen} title="매치타입" closeModal={toggleMatchTypeModal}>
                    <select value={matchType} onChange={(e) => { setMatchType(e.target.value); toggleMatchTypeModal(); }}>
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="팀리그">팀리그</option>
                    </select>
                </Modal>
                <Modal isOpen={isGenderModalOpen} title="성별" closeModal={toggleGenderModal}>
                    <select value={gender} onChange={(e) => { setGender(e.target.value); toggleGenderModal(); }}>
                        <option value="혼성">혼성</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                    </select>
                </Modal>
            </div>
        </>
    );
};

export default ScheduleList;