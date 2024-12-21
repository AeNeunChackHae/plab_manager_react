import React, { useState } from 'react';
import styles from './TeamManagementPage.module.css';

const players = [
    { id: 1, name: "김정은" },
    { id: 2, name: "진덕규" },
    { id: 3, name: "박정혁" },
    { id: 4, name: "최소라" },
    { id: 5, name: "김건희" },
    { id: 6, name: "유선호" }
];

const TeamManagementPage = () => {
    const [playerNumbers, setPlayerNumbers] = useState(new Array(players.length * 3).fill(''));

    const handleNumberChange = (index, event) => {
        const updatedNumbers = [...playerNumbers];
        updatedNumbers[index] = event.target.value;
        setPlayerNumbers(updatedNumbers);
    };

    return (
        <div className={styles.container}>
            <div className={styles.teamSetup}>
                {['red', 'yellow', 'blue'].map((color, colorIndex) => (
                    <div key={color} className={styles.teamColumn}>
                        {players.map((player, index) => (
                            <div key={player.id} className={styles.playerSlot}>
                                <input
                                    type="text"
                                    value={playerNumbers[index + colorIndex * players.length]}
                                    onChange={(e) => handleNumberChange(index + colorIndex * players.length, e)}
                                    className={styles.numberInput}
                                    placeholder={`Player ${index + 1} Number`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className={styles.completeButton}>완료</button>
        </div>
    );
};

export default TeamManagementPage;
