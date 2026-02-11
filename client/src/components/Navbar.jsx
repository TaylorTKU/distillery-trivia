import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '1rem 2rem', background: 'var(--surface)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent)' }}>Cultivated Trivia</h2>
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/live" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live Score</Link>
                    <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Register</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
