import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    icon?: React.ComponentType;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false, icon: Icon, className = '' }) => {
    const baseStyle = "flex items-center justify-center px-4 py-3 rounded-lg font-bold transition-all active:scale-95 shadow-sm hover:shadow-md select-none";
    
    let variantStyle = "";
    switch (variant) {
        case 'primary':
            variantStyle = "bg-cda-gold text-cda-green border border-cda-gold hover:bg-white hover:border-white";
            break;
        case 'secondary':
            variantStyle = "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white";
            break;
        case 'danger':
            variantStyle = "bg-transparent text-red-300 border border-red-500/50 hover:bg-red-900/20 hover:border-red-400";
            break;
    }

    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed active:scale-100" : "cursor-pointer";

    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variantStyle} ${disabledStyle} ${className}`}
        >
            {Icon && <span className="mr-2"><Icon /></span>}
            {children}
        </button>
    );
};