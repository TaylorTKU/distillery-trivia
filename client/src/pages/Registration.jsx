import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        isSeasonal: false,
        players: ['']
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddPlayer = () => {
        if (formData.players.length < 6) {
            setFormData({ ...formData, players: [...formData.players, ''] });
        }
    };

    const handlePlayerChange = (index, value) => {
        const newPlayers = [...formData.players];
        newPlayers[index] = value;
        setFormData({ ...formData, players: newPlayers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const filteredPlayers = formData.players.filter(p => p.trim() !== '');
            await axios.post('http://localhost:3001/api/teams/register', {
                ...formData,
                players: filteredPlayers
            });
            setSuccess(true);
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container">
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h2>Cheers! 🥃</h2>
                    <p style={{ margin: '1rem 0' }}>Your team <strong>{formData.name}</strong> is registered.</p>
                    <p>You can now see your scores on the live board.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="glass-card">
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Team Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Team Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="The Thirsty Thinkers"
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contact Email</label>
                        <input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder="captain@email.com"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Players (1-6)</label>
                        {formData.players.map((player, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Player ${index + 1}`}
                                value={player}
                                onChange={(e) => handlePlayerChange(index, e.target.value)}
                                style={{ marginBottom: '0.5rem' }}
                                required={index === 0}
                            />
                        ))}
                        {formData.players.length < 6 && (
                            <Button variant="ghost" type="button" onClick={handleAddPlayer} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                                + Add Player
                            </Button>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            style={{ width: 'auto' }}
                            checked={formData.isSeasonal}
                            onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                        />
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Count towards seasonal leaderboard</label>
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Team'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
