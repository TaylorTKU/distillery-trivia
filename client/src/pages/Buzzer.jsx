import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Button from '../components/Button';

const socket = io();

const Buzzer = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [buzzerState, setBuzzerState] = useState({ isOpen: false, winner: null });

    useEffect(() => {
        // Fetch teams
        const fetchTeams = async () => {
            try {
                const resp = await axios.get('/api/teams');
                // Sort teams alphabetically
                const sorted = resp.data.sort((a, b) => a.name.localeCompare(b.name));
                setTeams(sorted);
                
                // Auto-select if passed from registration
                const urlParams = new URLSearchParams(window.location.search);
                const queryTeamId = urlParams.get('teamId');
                
                // Or check local storage
                const savedTeamId = queryTeamId || localStorage.getItem('buzzer_team_id');
                if (savedTeamId) {
                    const found = sorted.find(t => t.id === savedTeamId);
                    if (found) setSelectedTeam(found);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTeams();

        // Socket setup
        socket.emit('get_buzzer_status');
        
        const handleStatus = (state) => {
            setBuzzerState(state);
        };
        
        socket.on('buzzer_status', handleStatus);

        return () => {
            socket.off('buzzer_status', handleStatus);
        };
    }, []);

    const handleSelectTeam = (e) => {
        const tId = e.target.value;
        const found = teams.find(t => t.id === tId);
        if (found) {
            setSelectedTeam(found);
            localStorage.setItem('buzzer_team_id', tId);
        } else {
            setSelectedTeam(null);
            localStorage.removeItem('buzzer_team_id');
        }
    };

    const handleBuzz = () => {
        if (!selectedTeam || !buzzerState.isOpen) return;
        
        // Optimistic UI could be applied, but trusting the socket is safer
        socket.emit('team_buzz', { id: selectedTeam.id, name: selectedTeam.name });
    };

    if (!selectedTeam) {
        return (
            <div className="container" style={{ maxWidth: '500px', marginTop: '10vh' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Team Buzzer</h1>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Select your team to enter the buzzer room.</p>
                    <select 
                        value="" 
                        onChange={handleSelectTeam}
                        style={{ width: '100%', marginBottom: '2rem', padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--background)', color: 'var(--text)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                    >
                        <option value="" disabled>-- Select Your Team --</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    // Determine UI state
    let bgColor = 'var(--glass)'; // Locked/Gray
    let textColor = 'var(--text-muted)';
    let msg = 'WAITING FOR HOST';
    let borderColor = 'var(--glass-border)';

    if (buzzerState.isOpen) {
        bgColor = '#2ecc71'; // Green
        textColor = '#fff';
        msg = 'BUZZ IN!';
        borderColor = '#27ae60';
    } else if (buzzerState.winner) {
        if (buzzerState.winner.id === selectedTeam.id) {
            bgColor = 'var(--accent)'; // Gold/Orange (We won)
            textColor = '#fff';
            msg = 'YOU GOT IT!';
            borderColor = '#a6774e';
        } else {
            bgColor = '#e74c3c'; // Red (Too slow)
            textColor = '#fff';
            msg = `${buzzerState.winner.name} WAS FASTER`;
            borderColor = '#c0392b';
        }
    }

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
            
            {/* Header */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
                <div style={{ fontWeight: 'bold' }}>{selectedTeam.name}</div>
                <button onClick={() => setSelectedTeam(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>Switch Team</button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                
                {/* Branding */}
                <img src="/logo.png" alt="Cultivated Cocktails" style={{ maxHeight: '100px', marginBottom: '3rem', opacity: 0.8 }} />

                {/* The Buzzer */}
                <button 
                    onClick={handleBuzz}
                    disabled={!buzzerState.isOpen}
                    style={{
                        width: '320px',
                        height: '320px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: bgColor,
                        color: textColor,
                        fontSize: buzzerState.winner && buzzerState.winner.id !== selectedTeam.id ? '1.5rem' : '3rem',
                        fontWeight: '900',
                        transition: 'all 0.1s',
                        cursor: buzzerState.isOpen ? 'pointer' : 'not-allowed',
                        borderBottom: buzzerState.isOpen ? `20px solid ${borderColor}` : `10px solid ${borderColor}`,
                        boxShadow: buzzerState.isOpen ? `0 20px 40px rgba(0,0,0,0.5), inset 0 10px 10px rgba(255,255,255,0.2)` : `0 10px 20px rgba(0,0,0,0.5), inset 0 5px 5px rgba(255,255,255,0.1)`,
                        transform: buzzerState.isOpen ? 'translateY(-10px)' : 'translateY(0)',
                        textTransform: 'uppercase',
                        wordBreak: 'break-word',
                        padding: '1rem',
                        userSelect: 'none'
                    }}
                    onMouseDown={(e) => { if(buzzerState.isOpen) e.currentTarget.style.transform = 'translateY(10px)'; }}
                    onMouseUp={(e) => { if(buzzerState.isOpen) e.currentTarget.style.transform = 'translateY(-10px)'; }}
                    onTouchStart={(e) => { if(buzzerState.isOpen) e.currentTarget.style.transform = 'translateY(10px)'; }}
                    onTouchEnd={(e) => { if(buzzerState.isOpen) e.currentTarget.style.transform = 'translateY(-10px)'; }}
                >
                    {msg}
                </button>
            </div>
        </div>
    );
};

export default Buzzer;
