import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '1.5rem 2rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Add your logo file to client/public/logo.png and then use it here */}
                    <img
                        src="/logo.png"
                        alt="Cultivated Cocktails Logo"
                        style={{ height: '50px', width: 'auto' }}
                        onError={(e) => e.target.style.display = 'none'}
                    />
                    <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary)', letterSpacing: '1px' }}>Cultivated Trivia</h2>
                </Link>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/live" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Standings</Link>
                    <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Signup</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
