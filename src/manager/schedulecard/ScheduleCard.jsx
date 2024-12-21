import React from "react";
import "./ScheduleCard.css";

const ScheduleCard = ({ time, location, teams, group, isWeekend }) => {
    const cardStyle = isWeekend ? "schedule-card weekend" : "schedule-card";

    return (
        <div className={cardStyle}>
            <div className="card-header">
                <h4>{group}</h4>
            </div>
            <div className="card-content">
                <p className="time">{time}</p>
                <p className="location">{location}</p>
                <p className="teams">{teams.join(' vs ')}</p>
            </div>
        </div>
    );
};


export default ScheduleCard;
