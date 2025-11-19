import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-cda-card rounded-xl shadow-lg border border-cda-greenLight/30 p-6 ${className}`}
        style={style}
    >
        {children}
    </div>
);