import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../components/Button';
import Login from './Login';

const AdminPanel = () => {
    const [token, setToken] = useState(localStorage.getItem('trivia_token'));
    const [seasons, setSeasons] = useState([]);
    const [newSeason, setNewSeason] = useState({ name: '', startDate: '' });
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [weekNumber, setWeekNumber] = useState(1);
    const [qrValue, setQrValue] = useState(window.location.origin + '/register');

    const fetchData = async () => {
        try {
            const resp = await axios.get('/api/seasons');
            setSeasons(resp.data);
            if (resp.data.length > 0) setSelectedSeason(resp.data.find(s => s.isActive) || resp.data[0]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleCreateSeason = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/seasons', newSeason, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
            setNewSeason({ name: '', startDate: '' });
        } catch (err) {
            alert('Failed to create season');
        }
    };

    const handleAddWeek = async () => {
        try {
            const weekResp = await axios.post('/api/weeks',
                { seasonId: selectedSeason.id, weekNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Create 5 rounds by default
            for (let i = 1; i <= 5; i++) {
                await axios.post(`/api/weeks/${weekResp.data.id}/rounds`,
                    { roundNumber: i, maxPoints: 10 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchData();
            alert(`Week ${weekNumber} created with 5 rounds!`);
        } catch (err) {
            alert('Failed to add week');
        }
    };

    const handleActivate = async (id) => {
        try {
            await axios.put(`/api/seasons/${id}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Failed to activate season');
        }
    };

    if (!token) return <Login onLogin={setToken} />;

    return (
        <div className="container">
            <h1>Admin Panel</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>

                {/* Season Management */}
                <div className="glass-card">
                    <h2>Seasons</h2>
                    <form onSubmit={handleCreateSeason} style={{ margin: '1rem 0' }}>
                        <input
                            type="text"
                            placeholder="Season Name (e.g. Spring 2024)"
                            value={newSeason.name}
                            onChange={e => setNewSeason({ ...newSeason, name: e.target.value })}
                            style={{ marginBottom: '0.5rem' }}
                            required
                        />
                        <input
                            type="date"
                            value={newSeason.startDate}
                            onChange={e => setNewSeason({ ...newSeason, startDate: e.target.value })}
                            style={{ marginBottom: '1rem' }}
                            required
                        />
                        <Button type="submit">Create Season</Button>
                    </form>

                    <div style={{ marginTop: '2rem' }}>
                        {seasons.map(s => (
                            <div key={s.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{s.name}</strong> {s.isActive && <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>(Active)</span>}
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(s.startDate).toLocaleDateString()}</div>
                                </div>
                                {!s.isActive && <Button variant="outline" onClick={() => handleActivate(s.id)} style={{ width: 'auto', padding: '0.4rem 0.8rem' }}>Activate</Button>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Season Actions */}
                <div className="glass-card">
                    <h2>Active Season Actions</h2>
                    {selectedSeason ? (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Managing: <strong>{selectedSeason.name}</strong></p>
                            <div style={{ margin: '1rem 0' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Next Week Number</label>
                                <input
                                    type="number"
                                    value={weekNumber}
                                    onChange={e => setWeekNumber(e.target.value)}
                                    style={{ marginBottom: '1rem' }}
                                />
                                <Button onClick={handleAddWeek}>Start New Week</Button>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>* Creates week with 5 default rounds</p>
                            </div>

                            <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

                            <h3>Promotion QR Code</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                                    <QRCodeSVG value={qrValue} size={150} />
                                </div>
                                <div style={{ marginTop: '1rem', width: '100%' }}>
                                    <select onChange={(e) => setQrValue(window.location.origin + e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--glass)', color: 'var(--text)' }}>
                                        <option value="/register">Signup QR</option>
                                        <option value="/live">Live Score QR</option>
                                    </select>
                                </div>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{qrValue}</p>
                            </div>
                        </div>
                    ) : (
                        <p>No active season selected.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;
