import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'RepTrack' }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center">
                    <i className="bi bi-person-arms-up text-white text-2xl" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-4 relative" ref={menuRef}>
                <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-card-dark flex items-center justify-center">
                    <i className="bi bi-bell text-xl" />
                </button>
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden"
                >
                    <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjx8WjcjNGPCUV1Yc9UXaix29xKJ9lvW80WgBZfIzz43UQoCyDtRcXJX-xNjB0f__atmDadqxTL89Ly_-qo3Rh3CYl6irHBWNyKbxD_UVcccsRJjCE69HnLXidHmZn787Xc8TC6pcgrZi_gL0N16SkkZGNUldcjbWWbDq_EdTxdR4X-AA9yg7l7It4ZpGqkYMJNEvGiMMoiBzuGBx8NSFwo0-mdrgZZJQEWFhzScgISBYbIw3IN_CbAKr5YlHHQNuNcniPhjZyCEFJ"
                        alt="Profile"
                    />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 top-14 w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card-dark shadow-lg p-3 space-y-3">
                        <div className="px-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email || 'No email'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Profile
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 dark:text-red-400"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
