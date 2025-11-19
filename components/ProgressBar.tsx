import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progress = Math.min(100, (current / total) * 100);
    
    return (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
            <div 
                className="h-full transition-all duration-500 ease-out bg-cda-gold shadow-[0_0_10px_rgba(212,175,55,0.7)]" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};
