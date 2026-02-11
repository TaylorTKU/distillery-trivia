import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '1rem',
        border: 'none',
        width: '100%',
        cursor: 'pointer'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: 'var(--background)'
        },
        outline: {
            backgroundColor: 'transparent',
            border: '1px solid var(--primary)',
            color: 'var(--primary)'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-muted)'
        }
    };

    const style = { ...baseStyle, ...variants[variant] };

    return (
        <button
            type={type}
            onClick={onClick}
            style={style}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
