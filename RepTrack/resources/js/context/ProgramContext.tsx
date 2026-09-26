import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProgramType } from '../types';

interface ProgramContextType {
    selectedProgram: ProgramType | null;
    programId: number | null;
    setProgram: (program: ProgramType, id: number) => void;
    clearProgram: () => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const useProgram = () => {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('useProgram must be used within a ProgramProvider');
    }
    return context;
};

interface ProgramProviderProps {
    children: ReactNode;
}

export const ProgramProvider: React.FC<ProgramProviderProps> = ({ children }) => {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
    const [programId, setProgramId] = useState<number | null>(null);

    const setProgram = (program: ProgramType, id: number) => {
        setSelectedProgram(program);
        setProgramId(id);
    };

    const clearProgram = () => {
        setSelectedProgram(null);
        setProgramId(null);
    };

    return (
        <ProgramContext.Provider
            value={{
                selectedProgram,
                programId,
                setProgram,
                clearProgram,
            }}
        >
            {children}
        </ProgramContext.Provider>
    );
};
