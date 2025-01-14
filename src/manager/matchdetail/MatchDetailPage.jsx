import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './MatchDetailPage.module.css';
import { config } from "../../config";

// 날짜를 "월 일 요일" 형식으로 포맷하는 함수
const formatDateToDay = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'long' });
  return `${month}월 ${day}일 ${dayOfWeek}`;
};

// 24시간 형식으로 시간 변환
const getTime24HourFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24시간 형식 사용
  });
};

const MatchDetail = () => {
  const api = config.aws.ec2_host_manager
  const { matchId } = useParams(); // URL에서 matchId 가져오기
  const [match, setMatch] = useState(null); // 매치 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(''); // 에러 상태
  const navigate = useNavigate();

  // 매치 데이터 불러오기
  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        console.log('Sending token and matchId:', {
          token: localStorage.getItem('token'),
          matchId,
        });

        const response = await fetch(`${api}/match/match-detail/matchId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            matchId
          }),
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('서버 응답:', result);

        setMatch(result);
      } catch (err) {
        console.error('Failed to load match detail:', err);
        setError('매치 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchDetail();
  }, [matchId]);

  const handleBackClick = () => {
    navigate('/schedule-list');
  };

  // 매치 신청 기능
  const handleApply = async () => {
    const confirmApply = window.confirm('신청하시겠습니까?');
    if (!confirmApply) return;

    try {
      const response = await fetch(`${api}/match/match-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          matchId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('매치 신청 응답:', result);

      alert('신청되었습니다!');
      navigate('/my-matches');
    } catch (err) {
      console.error('매치 신청 실패:', err);
      alert('매치 신청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!match) return <div>매치 정보를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      {/* 매치 선택 섹션 */}
      <div className={styles.matchInfo}>
        <h2 className={styles.title}>매치 정보</h2>
        <p className={styles.location}>{match.stadium_name}</p>
        <p className={styles.detail}>
          {match.allow_gender === 0 ? '남자' : match.allow_gender === 1 ? '여자' : '남녀모두'} ·{' '}
          {match.match_type === 1 ? '팀매치' : '소셜매치'}
        </p>
        <h2>일정</h2>
        <p>{formatDateToDay(match.match_start_time)}</p>
        <p>시작 시간: {getTime24HourFormat(match.match_start_time)}</p>
        <p>종료 시간: {getTime24HourFormat(match.match_end_time)}</p>
        <h2>구장 상세 주소</h2>
        <p>{match.full_address}</p>
      </div>

      {/* 구장 공지사항 */}
      <div className={styles.stadiumNotice}>
        <h2>구장 공지사항</h2>
        <pre className={styles.noticeInfo}>{match.notice}</pre>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={handleBackClick}>
          뒤로 가기
        </button>
        <button className={styles.applyButton} onClick={handleApply}>
          신청하기
        </button>
      </div>
    </div>
  );
};

export default MatchDetail;
