import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Login = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post('/api/auth/login', { password });
            localStorage.setItem('trivia_token', resp.data.token);
            onLogin(resp.data.token);
        } catch (err) {
            setError('Invalid password');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px' }}>
            <div className="glass-card">
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Host Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter host password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '1.5rem' }}
                    />
                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
                    <Button type="submit">Login</Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
