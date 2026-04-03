import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Registration = () => {
    const [formData, setFormData] = useState({
        teamName: '',
        isSeasonal: false,
        captainName: '',
        captainEmail: '',
        captainPhone: '',
        additionalPlayers: [] // Up to 7
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddPlayer = () => {
        if (formData.additionalPlayers.length < 7) {
            setFormData({
                ...formData,
                additionalPlayers: [...formData.additionalPlayers, { name: '', email: '', phone: '' }]
            });
        }
    };

    const handlePlayerChange = (index, field, value) => {
        const newPlayers = [...formData.additionalPlayers];
        newPlayers[index][field] = value;
        setFormData({ ...formData, additionalPlayers: newPlayers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure Captain has an email
        if (!formData.captainEmail.trim()) {
            alert('Team Captain Email is required!');
            return;
        }

        // Map UI state to the backend payload
        const mappedPlayers = [
            { 
                name: formData.captainName, 
                email: formData.captainEmail, 
                phone: formData.captainPhone 
            },
            ...formData.additionalPlayers.filter(p => p.name.trim() !== '')
        ];

        setLoading(true);
        try {
            await axios.post('/api/teams/register', {
                name: formData.teamName,
                contactEmail: formData.captainEmail, // Captain is the contact
                isSeasonal: formData.isSeasonal,
                players: mappedPlayers
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
                    <p style={{ margin: '1rem 0' }}>Your team <strong>{formData.teamName}</strong> is registered.</p>
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
                    
                    {/* Team Info Section */}
                    <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Team Info</h3>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Team Name</label>
                            <input
                                type="text"
                                required
                                value={formData.teamName}
                                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                placeholder="The Thirsty Thinkers"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                style={{ width: 'auto' }}
                                checked={formData.isSeasonal}
                                onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                            />
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Count towards seasonal leaderboard</label>
                        </div>
                    </div>

                    {/* Captain Section */}
                    <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Team Captain</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Captain Name"
                                value={formData.captainName}
                                onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                                required
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="Captain Email (Required)"
                                    value={formData.captainEmail}
                                    onChange={(e) => setFormData({ ...formData, captainEmail: e.target.value })}
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Captain Phone (Optional)"
                                    value={formData.captainPhone}
                                    onChange={(e) => setFormData({ ...formData, captainPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Players */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'var(--accent)', margin: 0 }}>Roster</h3>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Up to 8 total</span>
                        </div>
                        
                        {formData.additionalPlayers.map((player, index) => (
                            <div key={index} className="player-input-group" style={{ marginBottom: '1.5rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder={`Player ${index + 2} Name`}
                                    value={player.name}
                                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                    style={{ marginBottom: '0.5rem' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <input
                                        type="email"
                                        placeholder="Email (Optional)"
                                        value={player.email}
                                        onChange={(e) => handlePlayerChange(index, 'email', e.target.value)}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone (Optional)"
                                        value={player.phone}
                                        onChange={(e) => handlePlayerChange(index, 'phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                        
                        {formData.additionalPlayers.length < 7 && (
                            <Button variant="ghost" type="button" onClick={handleAddPlayer} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                                + Add Additional Player
                            </Button>
                        )}
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Complete Registration'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
