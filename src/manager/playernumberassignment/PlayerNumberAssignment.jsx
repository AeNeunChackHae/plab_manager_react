import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerNumberAssignment = () => {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const { data } = await axios.get('/api/players');
                setPlayers(data);
            } catch (error) {
                setError('Players could not be loaded.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlayers();
    }, []);

    const handleNumberChange = (id, number) => {
        setPlayers(players.map(player =>
            player.id === id ? { ...player, number: number } : player
        ));
    };

    const saveNumbers = async () => {
        try {
            await axios.post('/api/saveNumbers', players);
            alert('Numbers saved successfully!');
        } catch (error) {
            alert('Failed to save numbers.');
            console.error(error);
        }
    };

    if (isLoading) return <div>Loading players...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            {players.map(player => (
                <div className="player-item" key={player.id}>
                    <span>{player.name}</span>
                    <input
                        type="number"
                        value={player.number || ''}
                        onChange={(e) => handleNumberChange(player.id, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={saveNumbers}>Save Numbers</button>
        </div>
    );
};

export default PlayerNumberAssignment;
