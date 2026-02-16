import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io();

const LiveDisplay = () => {
    const [scores, setScores] = useState([]);
    const [activeWeek, setActiveWeek] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchScores = async (weekId) => {
        try {
            const resp = await axios.get(`/api/scores/week/${weekId}`);
            setScores(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // Initial fetch for the "latest" week (for simplicity, we'll get the active season's weeks)
        const init = async () => {
            try {
                const seasons = await axios.get('/api/seasons');
                const activeSeason = seasons.data.find(s => s.isActive);
                if (activeSeason && activeSeason.weeks.length > 0) {
                    const latestWeek = activeSeason.weeks[activeSeason.weeks.length - 1];
                    setActiveWeek(latestWeek);
                    await fetchScores(latestWeek.id);
                    socket.emit('join_room', `week_${latestWeek.id}`);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();

        socket.on('score_updated', (newScore) => {
            // Refresh scores for current week
            if (activeWeek) fetchScores(activeWeek.id);
        });

        socket.on('scores_published', () => {
            if (activeWeek) fetchScores(activeWeek.id);
        });

        return () => {
            socket.off('score_updated');
            socket.off('scores_published');
        };
    }, [activeWeek]);

    // Aggregate scores by team
    const teamTotals = scores.reduce((acc, curr) => {
        const teamName = curr.team.name;
        if (!acc[teamName]) acc[teamName] = 0;
        acc[teamName] += curr.points;
        return acc;
    }, {});

    const sortedTeams = Object.entries(teamTotals)
        .sort(([, a], [, b]) => b - a);

    if (loading) return <div className="container"><h1>Loading Scores...</h1></div>;

    return (
        <div style={{ padding: '3rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '4px' }}>
                Live Standings
            </h1>

            {activeWeek && (
                <h2 style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    Week {activeWeek.weekNumber}
                </h2>
            )}

            <div className="glass-card" style={{ width: '100%', maxWidth: '1000px', padding: '3rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--primary)', textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', fontSize: '2rem' }}>Team</th>
                            <th style={{ padding: '1.5rem', fontSize: '2rem', textAlign: 'right' }}>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTeams.map(([name, points], idx) => (
                            <tr key={name} style={{ borderBottom: '1px solid var(--glass-border)', background: idx < 3 ? 'rgba(193, 139, 92, 0.1)' : 'transparent' }}>
                                <td style={{ padding: '1.5rem', fontSize: '2.5rem', fontWeight: 700 }}>
                                    {idx === 0 && '🥇 '}
                                    {idx === 1 && '🥈 '}
                                    {idx === 2 && '🥉 '}
                                    {name}
                                </td>
                                <td style={{ padding: '1.5rem', fontSize: '2.5rem', fontWeight: 700, textAlign: 'right', color: 'var(--accent)' }}>
                                    {points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveDisplay;
