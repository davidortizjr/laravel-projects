import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const apiUser = await authAPI.login(email, password);
            if (!apiUser) {
                return false;
            }

            setUser(apiUser);
            localStorage.setItem('user', JSON.stringify(apiUser));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        void authAPI.logout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
