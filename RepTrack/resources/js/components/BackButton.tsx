import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="px-6 py-4">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-card-dark flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
            >
                <i className="bi bi-arrow-left" />
            </button>
        </div>
    );
};

export default BackButton;
