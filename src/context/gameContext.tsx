"use client";

import { GameMode, GameState } from "@/types/gameTypes";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
    useEffect,
} from "react";

interface GameContextType {
    mode: GameMode;
    time: number;
    wordCount: number;
    gameState: GameState;
    handleGameMode: (type: GameMode) => void;
    handleGameState: (state: GameState) => void;
    resetGame: () => void;
    handleSetTime: (time: number) => void;
    handleSetWordCount: (wordCount: number) => void;
    resetTrigger: number;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [gameMode, setGameMode] = useState<GameMode>("time");
    const [time, setTime] = useState<number>(30);
    const [wordCount, setWordCount] = useState<number>(25);
    const [resetTrigger, setResetTrigger] = useState<number>(0);
    const [gameState, setGameState] = useState<GameState>("idle");

    const handleGameMode = useCallback((type: GameMode) => {
        setGameMode(type);
    }, []);

    const handleSetTime = useCallback(
        (newTime: number) => {
            setTime((prevTime) => {
                if (gameMode === "time") {
                    return newTime;
                }
                return prevTime;
            });
        },
        [gameMode]
    );

    const handleGameState = useCallback((state: GameState) => {
        setGameState(state);
    }, []);
    const handleSetWordCount = useCallback((newWordCount: number) => {
        setWordCount(newWordCount);
    }, []);

    const resetGame = useCallback(() => {
        setResetTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        resetGame();
    }, [resetGame, time, wordCount]);

    const value = useMemo<GameContextType>(
        () => ({
            mode: gameMode,
            time,
            wordCount,
            gameState,
            handleGameMode,
            handleSetTime,
            handleSetWordCount,
            handleGameState,
            resetGame,
            resetTrigger,
        }),
        [
            gameMode,
            time,
            wordCount,
            gameState,
            resetTrigger,
            handleGameMode,
            handleSetTime,
            handleSetWordCount,
            handleGameState,
            resetGame,
        ]
    );

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === null) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};
