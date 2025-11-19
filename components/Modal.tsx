import React from 'react';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold mb-4 text-cda-green">{title}</h3>
            <div className="mb-6 text-gray-600 leading-relaxed">{children}</div>
            <div className="flex justify-end">{onClose}</div>
        </div>
    </div>
);
