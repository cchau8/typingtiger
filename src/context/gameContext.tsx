// contexts/GameContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type GameMode = "time" | "quote";

interface GameContextType {
    mode: GameMode;
    time: number;
    handleGameMode: (type: GameMode) => void;

    handleSetTime: (time: number) => void;
}

// Create context
const GameContext = createContext<GameContextType | null>(null);

// Provider
interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [gameMode, setGameMode] = useState<GameMode>("time");
    const [time, setTime] = useState<number>(30);

    const handleGameMode = (type: GameMode) => {
        setGameMode(type);
    };

    const handleSetTime = (newTime: number) => {
        setTime(newTime);
    };

    const value: GameContextType = {
        mode: gameMode,
        time,
        handleGameMode,
        handleSetTime,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

// Custom hook
export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === null) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};
