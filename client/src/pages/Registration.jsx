import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        isSeasonal: false,
        players: [{ name: '', email: '', phone: '' }]
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddPlayer = () => {
        if (formData.players.length < 6) {
            setFormData({ ...formData, players: [...formData.players, { name: '', email: '', phone: '' }] });
        }
    };

    const handlePlayerChange = (index, field, value) => {
        const newPlayers = [...formData.players];
        newPlayers[index][field] = value;
        setFormData({ ...formData, players: newPlayers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate player contact info
        const activePlayers = formData.players.filter(p => p.name.trim() !== '');

        for (const player of activePlayers) {
            if (!player.email.trim() && !player.phone.trim()) {
                alert(`Please provide either an email or a phone number for ${player.name}.`);
                return;
            }
        }

        setLoading(true);
        try {
            await axios.post('/api/teams/register', {
                ...formData,
                players: activePlayers
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
                        <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}>Players (1-6)</label>
                        {formData.players.map((player, index) => (
                            <div key={index} className="player-input-group" style={{ marginBottom: '1.5rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder={`Player ${index + 1} Name`}
                                    value={player.name}
                                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                    style={{ marginBottom: '0.5rem' }}
                                    required={index === 0}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={player.email}
                                        onChange={(e) => handlePlayerChange(index, 'email', e.target.value)}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={player.phone}
                                        onChange={(e) => handlePlayerChange(index, 'phone', e.target.value)}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                    * At least one contact method is required.
                                </p>
                            </div>
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
