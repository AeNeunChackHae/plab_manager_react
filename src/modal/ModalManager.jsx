import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ScheduleList.module.css';
import Modal from '../../Modal/Modal'; // 범용 모달 컴포넌트

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalConfig, setModalConfig] = useState({
        city: { open: false, choices: ['서울', '부산'], selected: '서울' },
        day: { open: false, choices: ['월요일', '화요일'], selected: '월요일' },
        time: { open: false, choices: ['오전', '오후'], selected: '오전' },
        matchType: { open: false, choices: ['친선', '리그'], selected: '친선' },
        gender: { open: false, choices: ['혼성', '남성', '여성'], selected: '혼성' }
    });

    const navigate = useNavigate();

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

    const toggleModal = (type) => {
        setModalConfig(prev => ({
            ...prev,
            [type]: { ...prev[type], open: !prev[type].open }
        }));
    };

    const handleSelection = (type, value) => {
        setModalConfig(prev => ({
            ...prev,
            [type]: { ...prev[type], selected: value, open: false }
        }));
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.scheduleContainer}>
            <div className={styles.filterContainer}>
                {Object.keys(modalConfig).map(key => (
                    <button key={key} onClick={() => toggleModal(key)}>
                        {key} 선택: {modalConfig[key].selected}
                    </button>
                ))}
            </div>

            {Object.keys(modalConfig).map(key => (
                <Modal
                    key={key}
                    isOpen={modalConfig[key].open}
                    title={`${key} 선택`}
                    closeModal={() => toggleModal(key)}
                >
                    <select value={modalConfig[key].selected} onChange={(e) => handleSelection(key, e.target.value)}>
                        {modalConfig[key].choices.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </Modal>
            ))}

            {schedules.map((daySchedule, index) => (
                <div key={index} className={styles.daySection}>
                    <h2 className={styles.dateTitle}>{daySchedule.date}</h2>
                    <div className={styles.schedules}>
                        {daySchedule.schedules.map((schedule, idx) => (
                            <div key={idx} className={styles.scheduleCard} onClick={() => navigate(`/match-detail/${schedule.id}`)}>
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
    );
};

export default ScheduleList;