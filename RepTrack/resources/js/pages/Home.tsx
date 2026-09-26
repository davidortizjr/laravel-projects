import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgram } from '../context/ProgramContext';
import Navbar from '../components/Navbar';
import type { ProgramType } from '../types';
import { useAuth } from '../context/AuthContext';
import { workoutAPI } from '../services/api';
import type { CustomWorkoutSummary } from '../types';

const Home: React.FC = () => {
    const { setProgram } = useProgram();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
    const [lastWorkout, setLastWorkout] = useState<string>('—');
    const [customPrograms, setCustomPrograms] = useState<CustomWorkoutSummary[]>([]);

    useEffect(() => {
        if (!user) {
            setTotalWorkouts(0);
            setLastWorkout('—');
            setCustomPrograms([]);
            return;
        }

        const loadStats = async () => {
            const workouts = await workoutAPI.getUserWorkouts(user.user_id);
            setTotalWorkouts(workouts.length);

            const programs = await workoutAPI.getUserCustomWorkouts(user.user_id);
            setCustomPrograms(programs);

            if (workouts.length === 0) {
                setLastWorkout('No workouts');
                return;
            }

            const latestWorkout = workouts[0];
            const loggedDate = latestWorkout.date ? new Date(latestWorkout.date) : null;

            if (!loggedDate || Number.isNaN(loggedDate.getTime())) {
                setLastWorkout('Recent');
                return;
            }

            const daysDiff = Math.max(0, Math.floor((Date.now() - loggedDate.getTime()) / (1000 * 60 * 60 * 24)));
            setLastWorkout(daysDiff === 0 ? 'Today' : `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`);
        };

        void loadStats();
    }, [user]);

    const programMap: Record<ProgramType, number> = {
        'PUSH PROGRAM': 1,
        'PULL PROGRAM': 2,
        'LEGS PROGRAM': 3,
        'CUSTOM': 4,
    };

    const handleProgramSelect = (programName: ProgramType) => {
        setProgram(programName, programMap[programName]);
        navigate('/workouts');
    };

    const handleCustomProgramSelect = (programId: number) => {
        setProgram('CUSTOM', programId);
        navigate('/workouts');
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-6">
            <Navbar title="RepTrack" />

            <main className="px-6 space-y-8 mt-4">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Your Progress
                        </h3>
                        <i className="bi bi-graph-up-arrow text-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-1">
                            <p className="text-xs font-medium text-slate-400 uppercase">Last Workout</p>
                            <p className="text-2xl font-bold text-primary">{lastWorkout}</p>
                            <p className="text-[10px] text-slate-400">from your latest log</p>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-1">
                            <p className="text-xs font-medium text-slate-400 uppercase">Total Workouts</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-2xl font-bold">{totalWorkouts}</p>
                                <i className="bi bi-star-fill text-sm text-yellow-500" />
                            </div>
                            <p className="text-[10px] text-slate-400">Level 2 Athlete</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-6">
                        <button
                            onClick={() => navigate('/pr')}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                        >
                            PRs
                        </button>
                        <button
                            onClick={() => navigate('/progress')}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                        >
                            VIEW PROGRESS
                        </button>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Select Your Program
                    </h3>

                    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDTVP2Qc05J07wlkn-VRbAr_yMZiSsOUC3DHjgr2O1LfXW4dpNVct5SNLgu6oBGEDejszt4n0FICNqWrN5MdxwK9-KwSkNWGuN71ZBma-YApwck2fx9EOGhAdRa5fezw0S7R3HvoksZhd4aIH2bwsWzB_XKdMSwEhUodmAauZ04EyENqO4ZIYiP1xCuAytxFOz7238GkmxQhShcu0_UzUibJvU6H9dAdPDCfSZp21FOM5PSaHSIxSud5MoLWcAqqsEixCoaAGs6b1ur')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">PUSH</h4>
                                <p className="text-white/70 text-sm">Chest, Shoulders & Triceps</p>
                            </div>
                            <button
                                onClick={() => handleProgramSelect('PUSH PROGRAM')}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                            >
                                TRAIN
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-3p9yEiQvJ9rpFSfbUO70qdvLYMKpVXx-oUZtjvVtTgs73JpybV3x-gI-ywFlFAmgwAOVmUos8ZWAOtK95Plnta36NWrvD_ZZUwwY_YFKRxZG4zcom-fq2rIcstKWleRMvUtGJsL0E2dxOLMXra8LxSqFP7EQW0C7A4vf5iTQmMXm3DgYjBRKNHaEbGvSs4H_OcOLGiGIm-3Vmt7sf1lViEydb3BWyNqyhSsWezawe28huCAw1gyf2iv_ljqRyzzXKvM88LcBPNTy')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">PULL</h4>
                                <p className="text-white/70 text-sm">Back, Biceps & Rear Delts</p>
                            </div>
                            <button
                                onClick={() => handleProgramSelect('PULL PROGRAM')}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                            >
                                TRAIN
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCt-SdIj0jCDrnwEttaDdeH2vju_RBb2H_SkkyTTHyY19k5Roc-VglQoBWpJSVT9RKRZ2ZEii0QXUykxfLtm143HTAOVOEy2a536ZSzBtvM9p4iTvXGS_nbs5iaj3dIbDOmgbgaNXjW5WVWSUThd94mAHeBUC757NXRj1vgfPyZ-6Ea6Bjonv5h-Ti110up83ftWSOn_j4DruZtth01hOwlGDa0DggvEGlFIrprpvxFVmj44kElPumdFozpRToVMye0-iHldvYYj5we')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">LEGS</h4>
                                <p className="text-white/70 text-sm">Quads, Hams, Glutes & Calves</p>
                            </div>
                            <button
                                onClick={() => handleProgramSelect('LEGS PROGRAM')}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                            >
                                TRAIN
                            </button>
                        </div>
                    </div>

                    {user && customPrograms.length > 0 && (
                        <div className="space-y-3">
                            {customPrograms.map((program) => (
                                <div
                                    key={program.program_id}
                                    className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white uppercase">{program.program_name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {program.exercise_count} exercise{program.exercise_count === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleCustomProgramSelect(program.program_id)}
                                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-bold text-xs tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
                                    >
                                        TRAIN
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <button
                        onClick={() => navigate('/custom-workout')}
                        className="w-full bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-white/10 p-6 rounded-xl flex items-center justify-center gap-3 group active:bg-slate-50 dark:active:bg-white/5 transition-colors"
                    >
                        <i className="bi bi-plus-circle text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-600 dark:text-slate-300">CUSTOM WORKOUT</span>
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Home;
