import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgram } from '../context/ProgramContext';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { exerciseAPI, workoutAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Exercise } from '../types';

interface ExerciseData {
    exercise_name: string;
    sets: number;
    reps: number;
    weight: number;
}

const Workouts: React.FC = () => {
    const { selectedProgram, programId } = useProgram();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutData, setWorkoutData] = useState<Record<string, ExerciseData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!programId) {
            navigate('/home');
            return;
        }

        if (!user) {
            return;
        }

        const loadExercises = async () => {
            const isCustomProgram = selectedProgram === 'CUSTOM' || programId === 4;

            if (!isCustomProgram) {
                const apiExercises = await exerciseAPI.getExercisesByProgram(programId);
                setExercises(apiExercises);
                return;
            }

            const customWorkouts = await workoutAPI.getUserCustomWorkouts(user.user_id);
            if (customWorkouts.length === 0) {
                setExercises([]);
                return;
            }

            const targetProgramId = programId === 4 ? customWorkouts[0].program_id : programId;
            const customWorkoutDetails = await workoutAPI.getCustomWorkoutDetails(targetProgramId, user.user_id);

            if (!customWorkoutDetails || customWorkoutDetails.exercise_ids.length === 0) {
                setExercises([]);
                return;
            }

            const allExercises = await exerciseAPI.getAllExercises();
            const exerciseById = new Map(
                allExercises
                    .filter((exercise): exercise is Exercise & { exercise_id: number } => Boolean(exercise.exercise_id))
                    .map((exercise) => [exercise.exercise_id, exercise])
            );

            const orderedCustomExercises: Exercise[] = customWorkoutDetails.exercise_ids
                .map((exerciseId) => exerciseById.get(exerciseId))
                .filter((exercise): exercise is Exercise & { exercise_id: number } => exercise !== undefined);

            setExercises(orderedCustomExercises);
        };

        void loadExercises();
    }, [programId, navigate, selectedProgram, user]);

    const handleInputChange = (exerciseName: string, field: keyof ExerciseData, value: string) => {
        setWorkoutData((prev) => ({
            ...prev,
            [exerciseName]: {
                ...prev[exerciseName],
                exercise_name: exerciseName,
                [field]: field === 'exercise_name' ? value : Number(value),
            } as ExerciseData,
        }));
    };

    const handleSubmitAll = async () => {
        if (!user) {
            return;
        }

        const workoutsToLog = exercises
            .map((exercise) => {
                const data = workoutData[exercise.exercise_name];

                if (!data || !data.sets || !data.reps || !data.weight || !exercise.exercise_id) {
                    return null;
                }

                return {
                    exerciseName: exercise.exercise_name,
                    payload: {
                        user_id: user.user_id,
                        exercise_id: exercise.exercise_id,
                        sets: data.sets,
                        reps: data.reps,
                        weight: data.weight,
                    },
                };
            })
            .filter((entry): entry is { exerciseName: string; payload: Parameters<typeof workoutAPI.logWorkout>[0] } =>
                Boolean(entry)
            );

        if (!workoutsToLog.length) {
            alert('Enter sets, reps, and weight for at least one exercise before logging.');
            return;
        }

        try {
            setIsSubmitting(true);
            await Promise.all(workoutsToLog.map((entry) => workoutAPI.logWorkout(entry.payload)));

            alert(`Workout logged for ${workoutsToLog.length} exercise(s).`);

            setWorkoutData((prev) => {
                const newData = { ...prev };

                workoutsToLog.forEach((entry) => {
                    delete newData[entry.exerciseName];
                });

                return newData;
            });
        } catch (error) {
            console.error(error);
            alert('Failed to log workout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-32">
            <Navbar title={selectedProgram || 'WORKOUTS'} />
            <BackButton />

            <main className="px-6 mt-2 space-y-4">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.exercise_name}
                        className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5"
                    >
                        <h5 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                            {exercise.exercise_name}
                        </h5>

                        <div className="space-y-4">
                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <label
                                        htmlFor={`sets-${exercise.exercise_name}`}
                                        className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                    >
                                        Sets
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                        id={`sets-${exercise.exercise_name}`}
                                        value={workoutData[exercise.exercise_name]?.sets || ''}
                                        onChange={(e) =>
                                            handleInputChange(exercise.exercise_name, 'sets', e.target.value)
                                        }
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                                <span className="text-slate-400 dark:text-slate-500 font-bold pb-2 text-xl">×</span>
                                <div className="flex-1">
                                    <label
                                        htmlFor={`reps-${exercise.exercise_name}`}
                                        className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                    >
                                        Reps
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                        id={`reps-${exercise.exercise_name}`}
                                        value={workoutData[exercise.exercise_name]?.reps || ''}
                                        onChange={(e) =>
                                            handleInputChange(exercise.exercise_name, 'reps', e.target.value)
                                        }
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor={`weight-${exercise.exercise_name}`}
                                    className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide"
                                >
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                                    id={`weight-${exercise.exercise_name}`}
                                    value={workoutData[exercise.exercise_name]?.weight || ''}
                                    onChange={(e) =>
                                        handleInputChange(exercise.exercise_name, 'weight', e.target.value)
                                    }
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                        </div>
                    </div>
                ))}

                <button
                    className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => void handleSubmitAll()}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'LOGGING WORKOUT...' : 'LOG WORKOUT'}
                </button>
            </main>
        </div>
    );
};

export default Workouts;
