import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const goToManagerInfo = () => {
        navigate('/manager-info');  // 'my-page'로 수정된 경로
    };

    const goToMyMatches = () => {
        navigate('/my-matches');  // 'calendar'는 캘린더 페이지의 경로로, 실제 경로에 맞게 수정해야 합니다.
    };

    const goToScheduleList = () => {
        navigate('/schedule-list');
    }
    
    return (
        <header className="header">
            <div className="logo">
                <img 
                    src="/assets/image/plab_manager_logo_white.png" 
                    alt="Logo" 
                    onClick={goToScheduleList}
                />
            </div>
            <div className="icons">
                <img
                    src="/assets/image/header_cal.png"
                    alt="Calendar Icon"
                    className="calendar-icon"
                    onClick={goToMyMatches} // 캘린더 페이지로 이동하는 클릭 이벤트 핸들러
                />
                <img
                    src="/assets/image/my.png"
                    alt="User Icon"
                    className="user-icon"
                    onClick={goToManagerInfo} // 마이페이지로 이동하는 클릭 이벤트 핸들러
                />
            </div>
        </header>
    );
};

export default Header;
