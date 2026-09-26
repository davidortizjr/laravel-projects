import React, { useEffect, useMemo, useState } from 'react';

type ExerciseCategory = 'all' | 'chest' | 'back' | 'legs' | 'arms';

export interface CustomExercise {
    id: number;
    name: string;
    tag: string;
    image: string;
}

interface AddExerciseModalProps {
    isOpen: boolean;
    exercises: CustomExercise[];
    selectedExercises: CustomExercise[];
    onClose: () => void;
    onPickExercise: (exercise: CustomExercise) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
    isOpen,
    exercises,
    selectedExercises,
    onClose,
    onPickExercise,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<ExerciseCategory>('all');
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animationPhase, setAnimationPhase] = useState<'enter' | 'exit'>('exit');

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setAnimationPhase('exit');

            const animationFrameId = window.requestAnimationFrame(() => {
                setAnimationPhase('enter');
            });

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            };
        }

        if (!shouldRender) {
            setAnimationPhase('exit');
            return;
        }

        setAnimationPhase('exit');
        const closeTimerId = window.setTimeout(() => {
            setShouldRender(false);
        }, 200);

        return () => {
            window.clearTimeout(closeTimerId);
        };
    }, [isOpen, shouldRender]);

    const filteredExercises = useMemo(() => {
        return exercises.filter((exercise) => {
            const tagCategory = exercise.tag.split('•')[0]?.trim().toLowerCase();
            const matchesCategory = activeCategory === 'all' || tagCategory === activeCategory;
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, exercises, searchQuery]);

    if (!shouldRender) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 ${animationPhase === 'enter' ? 'bg-black/60 opacity-100' : 'bg-black/0 opacity-0'
                    }`}
                onClick={onClose}
                aria-label="Close add exercise modal"
            />

            <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-card-dark rounded-t-[2.5rem] shadow-2xl flex flex-col h-[90dvh] transform transition-transform ${animationPhase === 'enter' ? 'duration-[300ms]' : 'duration-[200ms]'
                    } ease-out ${animationPhase === 'enter' ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                <div className="w-full flex justify-center py-3">
                    <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/10 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-6 pb-4">
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                        Add Exercise
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-primary font-bold text-sm tracking-widest"
                    >
                        DONE
                    </button>
                </div>

                <div className="px-6 mb-4">
                    <div className="relative group">
                        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full bg-card-dark border-none rounded-2xl py-4 pl-12 pr-4 font-semibold shadow-xl text-white focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                            placeholder="Search exercise..."
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>

                <div className="px-6 py-5 mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveCategory('all')}
                        className={`px-6 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-input-dark text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveCategory('chest')}
                        className={`px-6 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === 'chest'
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-input-dark text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Chest
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveCategory('back')}
                        className={`px-6 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === 'back'
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-input-dark text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveCategory('legs')}
                        className={`px-6 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === 'legs'
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-input-dark text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Legs
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveCategory('arms')}
                        className={`px-6 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === 'arms'
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-input-dark text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Arms
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-6 space-y-4 pb-12">
                    {filteredExercises.map((exercise) => {
                        const isSelected = selectedExercises.some((selected) => selected.id === exercise.id);

                        return (
                            <div key={exercise.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-input-dark">
                                        <img alt="Exercise" className="w-full h-full object-cover" src={exercise.image} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{exercise.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                                            {exercise.tag}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={isSelected}
                                    onClick={() => onPickExercise(exercise)}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-input-dark flex items-center justify-center text-primary active:scale-90 transition-transform disabled:opacity-60"
                                >
                                    <i className={`bi ${isSelected ? 'bi-check-lg' : 'bi-plus-lg'}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="h-8 bg-background-light dark:bg-card-dark shrink-0">
                    <div className="mx-auto w-32 h-1 bg-slate-300 dark:bg-white/20 rounded-full mt-4" />
                </div>
            </div>
        </>
    );
};

export default AddExerciseModal;