import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import AddExerciseModal from '../components/AddExerciseModal';
import type { CustomExercise } from '../components/AddExerciseModal';
import { exerciseAPI, workoutAPI } from '../services/api';
import type { Exercise } from '../types';
import { useAuth } from '../context/AuthContext';

const fallbackImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDTVP2Qc05J07wlkn-VRbAr_yMZiSsOUC3DHjgr2O1LfXW4dpNVct5SNLgu6oBGEDejszt4n0FICNqWrN5MdxwK9-KwSkNWGuN71ZBma-YApwck2fx9EOGhAdRa5fezw0S7R3HvoksZhd4aIH2bwsWzB_XKdMSwEhUodmAauZ04EyENqO4ZIYiP1xCuAytxFOz7238GkmxQhShcu0_UzUibJvU6H9dAdPDCfSZp21FOM5PSaHSIxSud5MoLWcAqqsEixCoaAGs6b1ur';

const getProgramTag = (programId: number) => {
    if (programId === 1) return 'Chest • Strength';
    if (programId === 2) return 'Back • Strength';
    if (programId === 3) return 'Legs • Strength';
    return 'Custom • Strength';
};

const mapExerciseToCustom = (exercise: Exercise): CustomExercise | null => {
    if (!exercise.exercise_id || exercise.exercise_id <= 0) {
        return null;
    }

    return {
        id: exercise.exercise_id,
        name: exercise.exercise_name,
        tag: getProgramTag(exercise.program_id),
        image: fallbackImage,
    };
};

function SortableItem({
    exercise,
    isDragging,
    onHandlePointerDown,
    onHandlePointerUp,
    onHandlePointerMove,
    onRemove,
}: {
    exercise: CustomExercise;
    isDragging: boolean;
    onHandlePointerDown: (id: string) => void;
    onHandlePointerUp: () => void;
    onHandlePointerMove: (e: React.PointerEvent) => void;
    onRemove: (id: number) => void;
}) {
    return (
        <div
            data-exercise-id={exercise.id.toString()}
            className={`flex items-center justify-between bg-white dark:bg-card-dark p-3 pr-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm group transition-all duration-200 ease-out ${isDragging ? 'scale-[1.02] -translate-y-0.5 shadow-lg shadow-primary/20 ring-2 ring-primary/30 z-10' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-input-dark">
                    <img alt={exercise.name} className="w-full h-full object-cover opacity-80" src={exercise.image} />
                </div>
                <div>
                    <p className="font-bold text-slate-800 dark:text-white">{exercise.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">{exercise.tag}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onRemove(exercise.id)}
                    className="w-9 h-9 rounded-full bg-input-dark flex items-center justify-center text-red-800 transition-colors"
                    aria-label={`Delete ${exercise.name}`}
                >
                    <i className="bi bi-trash text-[20px]" />
                </button>
                <button
                    type="button"
                    onPointerDown={() => onHandlePointerDown(exercise.id.toString())}
                    onPointerMove={onHandlePointerMove}
                    onPointerUp={onHandlePointerUp}
                    onPointerCancel={onHandlePointerUp}
                    className={`transition-colors cursor-grab active:cursor-grabbing touch-none select-none ${isDragging ? 'text-primary' : 'text-slate-300 dark:text-slate-600 hover:text-primary'}`}
                    aria-label={`Drag ${exercise.name}`}
                >
                    <i className="bi bi-grip-vertical" />
                </button>
            </div>
        </div>
    );
}

const CustomWorkout: React.FC = () => {
    const { user } = useAuth();
    const [workoutName, setWorkoutName] = useState('');
    const [exercisePool, setExercisePool] = useState<CustomExercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<CustomExercise[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoadingExercises, setIsLoadingExercises] = useState(true);
    const [isSavingWorkout, setIsSavingWorkout] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadExercises = async () => {
            setIsLoadingExercises(true);
            const exercises = await exerciseAPI.getAllExercises();

            if (!isActive) {
                return;
            }

            const mappedExercises = exercises
                .map(mapExerciseToCustom)
                .filter((exercise): exercise is CustomExercise => exercise !== null);
            setExercisePool(mappedExercises);
            setSelectedExercises(mappedExercises.slice(0, 3));
            setIsLoadingExercises(false);
        };

        loadExercises();

        return () => {
            isActive = false;
        };
    }, []);

    const handleAddExercise = () => {
        setIsAddModalOpen(true);
    };

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const lastSwapTargetRef = useRef<string | null>(null);

    const handleHandlePointerDown = (id: string) => {
        setDraggedId(id);
        lastSwapTargetRef.current = null;
    };

    const handleHandlePointerUp = () => {
        setDraggedId(null);
        lastSwapTargetRef.current = null;
    };

    const reorderExercises = (fromId: string, toId: string) => {
        if (fromId === toId) {
            return;
        }

        setSelectedExercises((prev) => {
            const fromIndex = prev.findIndex((p) => p.id.toString() === fromId);
            const toIndex = prev.findIndex((p) => p.id.toString() === toId);
            if (fromIndex === -1 || toIndex === -1) return prev;

            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const handleHandlePointerMove = (e: React.PointerEvent) => {
        if (!draggedId) {
            return;
        }

        const targetElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const targetItem = targetElement?.closest('[data-exercise-id]') as HTMLElement | null;
        const toId = targetItem?.getAttribute('data-exercise-id');

        if (!toId || toId === draggedId || toId === lastSwapTargetRef.current) {
            return;
        }

        reorderExercises(draggedId, toId);
        lastSwapTargetRef.current = toId;
    };

    useEffect(() => {
        if (!draggedId) {
            return;
        }

        const clearDrag = () => setDraggedId(null);
        window.addEventListener('pointerup', clearDrag);
        window.addEventListener('pointercancel', clearDrag);

        return () => {
            window.removeEventListener('pointerup', clearDrag);
            window.removeEventListener('pointercancel', clearDrag);
        };
    }, [draggedId]);

    const handlePickExercise = (exercise: CustomExercise) => {
        const alreadySelected = selectedExercises.some((selected) => selected.id === exercise.id);

        if (alreadySelected) {
            return;
        }

        setSelectedExercises((prev) => [...prev, exercise]);
    };

    const handleRemoveExercise = (exerciseId: number) => {
        setSelectedExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    };

    const handleSaveWorkout = async () => {
        const trimmedName = workoutName.trim();

        if (!user) {
            alert('Please login to save a custom workout.');
            return;
        }

        if (!trimmedName) {
            alert('Please enter a workout name.');
            return;
        }

        const orderedExerciseIds = selectedExercises
            .map((exercise) => exercise.id)
            .filter((id) => Number.isFinite(id) && id > 0);

        if (orderedExerciseIds.length === 0) {
            alert('Please select at least one exercise.');
            return;
        }

        try {
            setIsSavingWorkout(true);
            await workoutAPI.saveCustomWorkout({
                name: trimmedName,
                exerciseIds: orderedExerciseIds,
            });
            alert('Custom workout saved to database.');
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save custom workout.';
            alert(errorMessage);
        } finally {
            setIsSavingWorkout(false);
        }
    };

    return (
        <div
            className={`bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col pb-32 ${isAddModalOpen ? 'overflow-hidden' : ''
                }`}
        >
            <Navbar title="RepTrack" />
            <BackButton />
            <main className={`px-6 flex-grow ${isAddModalOpen ? 'opacity-40' : ''}`}>
                <div className="mt-2 mb-8">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                        CREATE CUSTOM WORKOUT
                    </h2>
                    <div className="h-1 w-12 bg-primary mt-1 rounded-full" />
                </div>

                <div className="space-y-2 mb-8">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                        Workout Name
                    </label>
                    <input
                        className="w-full bg-white dark:bg-card-dark border-none rounded-2xl p-5 text-lg font-semibold shadow-sm focus:ring-2 focus:ring-primary/50 transition-all dark:placeholder:text-slate-600"
                        placeholder="e.g. Friday Burn"
                        type="text"
                        value={workoutName}
                        onChange={(event) => setWorkoutName(event.target.value)}
                    />
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Exercises
                        </h3>
                        <span className="text-xs font-bold text-primary">
                            {selectedExercises.length} SELECTED
                        </span>
                    </div>

                    <div className="space-y-3">
                        {selectedExercises.length > 0 ? (
                            selectedExercises.map((exercise) => (
                                <SortableItem
                                    key={exercise.id}
                                    exercise={exercise}
                                    isDragging={draggedId === exercise.id.toString()}
                                    onHandlePointerDown={handleHandlePointerDown}
                                    onHandlePointerMove={handleHandlePointerMove}
                                    onHandlePointerUp={handleHandlePointerUp}
                                    onRemove={handleRemoveExercise}
                                />
                            ))
                        ) : (
                            <div className="bg-white dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-sm">
                                {isLoadingExercises ? 'Loading exercises...' : 'No exercises found in database.'}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddExercise}
                        disabled={isLoadingExercises || exercisePool.length === 0}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-primary/40 rounded-2xl text-primary font-bold hover:bg-primary/5 transition-colors active:scale-95"
                    >
                        <i className="bi bi-plus-circle text-xl" />
                        ADD EXERCISE
                    </button>
                </section>
            </main>

            {!isAddModalOpen && (
                <>
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-40">
                        <button
                            type="button"
                            onClick={() => void handleSaveWorkout()}
                            disabled={isSavingWorkout}
                            className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-full flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 font-black text-lg tracking-widest transition-transform active:scale-95 uppercase"
                        >
                            {isSavingWorkout ? 'SAVING...' : 'SAVE WORKOUT'}
                        </button>
                    </div>
                </>
            )}

            <AddExerciseModal
                isOpen={isAddModalOpen}
                exercises={exercisePool}
                selectedExercises={selectedExercises}
                onClose={() => setIsAddModalOpen(false)}
                onPickExercise={handlePickExercise}
            />
        </div>
    );
};

export default CustomWorkout;