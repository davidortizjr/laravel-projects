import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ExerciseProgress {
    exercise_name: string;
    weight: number;
    reps: number;
}

interface ProgramProgress {
    program_name: string;
    exercises: ExerciseProgress[];
}

const Progress: React.FC = () => {
    const { user } = useAuth();
    const [progressData, setProgressData] = useState<ProgramProgress[]>([]);

    useEffect(() => {
        if (!user) {
            setProgressData([]);
            return;
        }

        const loadProgress = async () => {
            const data = await progressAPI.getUserProgress(user.user_id);
            setProgressData(data);
        };

        void loadProgress();
    }, [user]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-32">
            <Navbar title="PROGRESS" />
            <BackButton />

            <main className="px-6 mt-2 space-y-8">
                <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-800 dark:text-white">YOUR PROGRESS</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your best lifts</p>
                </div>

                {progressData.map((program) => (
                    <section key={program.program_name} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-person-arms-up text-primary" />
                            <h5 className="text-lg font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                {program.program_name}
                            </h5>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {program.exercises.map((exercise) => (
                                <div
                                    key={exercise.exercise_name}
                                    className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-2"
                                >
                                    <h6 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-2 min-h-[2.5rem]">
                                        {exercise.exercise_name}
                                    </h6>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-primary">{exercise.weight}</span>
                                        <span className="text-xs text-slate-400">kg</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        × {exercise.reps} reps
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <div className="mt-8 bg-white dark:bg-card-dark border-2 border-dashed border-slate-200 dark:border-white/10 p-8 rounded-xl flex flex-col items-center gap-3">
                    <i className="bi bi-bar-chart text-4xl text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Keep logging workouts to track your progress over time
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Progress;
