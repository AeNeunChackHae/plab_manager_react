import React from "react";
import "./Dashboard.css";
import Header from "../../components/shared/Header";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">
                    <span>plab</span> /manager
                </div>
                <div className="header-icons">
                    <i className="icon-calendar">📅</i>
                    <i className="icon-user">👤</i>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="user-info">
                    <h2>김정섭</h2>
                    <p className="user-email">mcshady@nate.com</p>
                    <div className="match-stats">
                        <p>이번달 / 누적 진행 경기</p>
                        <div className="match-count">
                            <span>⚽ 0 / 0 경기</span>
                        </div>
                    </div>
                </div>
                <nav className="dashboard-nav">
                    <ul>
                        <li>
                            <i className="icon-calendar">📅</i> 나의 매치
                        </li>
                        <li>
                            <i className="icon-review">😊</i> 매치 리뷰
                        </li>
                        <li>
                            <i className="icon-settings">⚙️</i> 설정
                        </li>
                    </ul>
                </nav>
            </main>
        </div>
    );
};

export default Dashboard;
