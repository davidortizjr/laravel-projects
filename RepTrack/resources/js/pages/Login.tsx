import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(email, password);
        if (success) {
            navigate('/home');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-primary p-4 rounded-full">
                            <i className="bi bi-person-arms-up text-white text-5xl" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">RepTrack</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Track your fitness journey</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-8">
                    <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <a href="#" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
