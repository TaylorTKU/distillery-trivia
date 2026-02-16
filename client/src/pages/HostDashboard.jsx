import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Login from './Login';

const HostDashboard = () => {
    const [token, setToken] = useState(localStorage.getItem('trivia_token'));
    const [activeWeek, setActiveWeek] = useState(null);
    const [teams, setTeams] = useState([]);
    const [scores, setScores] = useState({}); // { teamId_roundId: points }
    const [publishing, setPublishing] = useState(false);

    const fetchSession = async () => {
        try {
            const seasons = await axios.get('/api/seasons');
            const activeSeason = seasons.data.find(s => s.isActive);
            if (activeSeason && activeSeason.weeks.length > 0) {
                const latestWeek = activeSeason.weeks[activeSeason.weeks.length - 1];
                setActiveWeek(latestWeek);
                const teamsResp = await axios.get('/api/teams');
                setTeams(teamsResp.data);
                const scoresResp = await axios.get(`/api/scores/week/${latestWeek.id}`);
                const scoreMap = {};
                scoresResp.data.forEach(s => {
                    scoreMap[`${s.teamId}_${s.roundId}`] = s.points;
                });
                setScores(scoreMap);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchSession();
    }, [token]);

    const handleScoreChange = async (teamId, roundId, points) => {
        const val = parseInt(points) || 0;
        setScores({ ...scores, [`${teamId}_${roundId}`]: val });
        try {
            await axios.post('/api/scores',
                { weekId: activeWeek.id, teamId, roundId, points: val },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error('Failed to save score');
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        try {
            await axios.post(`/api/scores/week/${activeWeek.id}/publish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Scores published to live display!');
        } catch (err) {
            alert('Publish failed');
        } finally {
            setPublishing(false);
        }
    };

    if (!token) return <Login onLogin={setToken} />;
    if (!activeWeek) return <div className="container"><h1>No active week found.</h1><p>Set up a season and week in the Admin Panel.</p></div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Host Dashboard - Week {activeWeek.weekNumber}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="outline" onClick={handlePublish} disabled={publishing}>
                        {publishing ? 'Publishing...' : 'Publish Scores'}
                    </Button>
                    <Button variant="ghost" onClick={() => { localStorage.removeItem('trivia_token'); setToken(null); }}>Logout</Button>
                </div>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--primary)' }}>
                            <th style={{ padding: '1rem' }}>Team</th>
                            {activeWeek.rounds.map(r => (
                                <th key={r.id} style={{ padding: '1rem', textAlign: 'center' }}>R{r.roundNumber}</th>
                            ))}
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => {
                            let total = 0;
                            return (
                                <tr key={team.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{team.name}</td>
                                    {activeWeek.rounds.map(r => {
                                        const s = scores[`${team.id}_${r.id}`] || 0;
                                        total += s;
                                        return (
                                            <td key={r.id} style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    value={s}
                                                    onChange={(e) => handleScoreChange(team.id, r.id, e.target.value)}
                                                    style={{ width: '60px', textAlign: 'center', padding: '0.5rem' }}
                                                />
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{total}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HostDashboard;
