"use client";

import Stats from "@/app/components/Stats";
import Typer from "@/app/components/Typer/Typer";
import { useGameContext } from "@/context/gameContext";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDevMode } from "@/hooks/useDevMode";
import { Button } from "@/components/ui/button";
import GameHeader from "@/app/components/Header/GameHeader";
import { GameModeStrategy } from "@/strategies/gameStrategies";
import { createTimeModeStrategy } from "@/strategies/timeModeStrategy";
import { GameEndConditionData } from "@/types/gameTypes";
import { useGameStats } from "@/hooks/useGameStats";
import { createQuoteModeStrategy } from "@/strategies/quoteModeStrategy";
import { createWordModeStrategy } from "@/strategies/wordModeStrategy";
import { AnimatePresence, motion } from "motion/react";
import WordCountDisplay from "@/app/components/GameInfo/WordCountDisplay";
import TimeDisplay from "@/app/components/GameInfo/TimeDisplay";

interface GameConfig {
    initialTimer: number;
    words: string[];
}

export default function GameInterface() {
    const { mode, time, resetTrigger, gameState, handleGameState, wordCount } =
        useGameContext();
    const {
        rawCharHistory,
        charHistory,
        errors,
        resetStats,
        recordSecond,
        handleSkipGame,
        skipGame,
        incrementCps,
        finalizeStats,
    } = useGameStats();
    const { isDevMode } = useDevMode();
    const [typedWordCount, setTypedWordCount] = useState<number>(0);

    const [timer, setTimer] = useState<number>(time);
    const [words, setWords] = useState<string[]>([]);

    const typedRef = useRef<string[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const strategy = useMemo((): GameModeStrategy => {
        switch (mode) {
            case "time":
                return createTimeModeStrategy(time);
            case "quote":
                return createQuoteModeStrategy();
            case "words":
                return createWordModeStrategy(wordCount);
            default:
                return createTimeModeStrategy(time);
        }
    }, [mode, time, wordCount]);

    const strategyRef = useRef(strategy);
    strategyRef.current = strategy;

    const initializeGame = useCallback((): GameConfig => {
        return strategy.initializeGame();
    }, [strategy]);
    const checkEndGame = useCallback(() => {
        if (gameState !== "running") return false;

        const currentState: GameEndConditionData = {
            timer,
            typed: typedRef.current,
            gameState: "running",
            wordCount: typedRef.current.length,
            words,
        };

        if (strategyRef.current.shouldEndGame(currentState)) {
            handleGameState("finished");
            finalizeStats();
            return true;
        }
        return false;
    }, [gameState, timer, words, handleGameState, finalizeStats]);

    const stopGameTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startGameTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            if (checkEndGame()) {
                return;
            }

            recordSecond();

            setTimer((prevTimer) => {
                const newTimer = strategyRef.current.updateTimer(prevTimer);

                setTimeout(() => {
                    const currentState: GameEndConditionData = {
                        timer: newTimer,
                        typed: typedRef.current,
                        gameState: "running",
                        wordCount: typedRef.current.length,
                        words,
                    };

                    if (strategyRef.current.shouldEndGame(currentState)) {
                        handleGameState("finished");
                        finalizeStats();
                    }
                }, 0);

                return newTimer;
            });
        }, 1000);
    }, [recordSecond, checkEndGame, words, handleGameState, finalizeStats]);

    const resetGame = useCallback(() => {
        const config = initializeGame();
        setTimer(config.initialTimer);
        typedRef.current = [];
        setWords(config.words);
        stopGameTimer();

        resetStats();
        handleGameState("idle");
    }, [initializeGame, resetStats, stopGameTimer, handleGameState]);

    const startTyping = useCallback(() => {
        if (gameState === "idle") {
            handleGameState("running");
        }
    }, [gameState, handleGameState]);

    const handleWordComplete = useCallback(() => {
        setTypedWordCount(typedRef.current.length);
        checkEndGame();
    }, [checkEndGame]);

    useEffect(() => {
        const config = initializeGame();
        setTimer(config.initialTimer);
        setWords(config.words);
    }, [mode, time, initializeGame]);

    useEffect(() => {
        if (resetTrigger > 0) {
            resetGame();
        }
    }, [resetTrigger, resetGame]);

    useEffect(() => {
        if (gameState === "running") {
            startGameTimer();
        } else {
            stopGameTimer();
        }

        return () => {
            stopGameTimer();
        };
    }, [gameState, startGameTimer, stopGameTimer]);

    useEffect(() => {
        if (gameState !== "running") return;

        const currentState: GameEndConditionData = {
            timer,
            typed: typedRef.current,
            gameState: "running",
            wordCount: typedRef.current.length,
            words,
        };

        if (strategy.shouldEndGame(currentState)) {
            handleGameState("finished");
            finalizeStats();
        }
    }, [timer, gameState, strategy, handleGameState, finalizeStats, words]);

    useEffect(() => {
        if (skipGame) {
            stopGameTimer();
            handleGameState("finished");
        }
    }, [skipGame, stopGameTimer, handleGameState]);

    useEffect(() => {
        return () => {
            stopGameTimer();
        };
    }, [stopGameTimer]);
    const getAnimationKey = useCallback(() => {
        if (mode === "time") {
            return `time-${time}-${words.slice(0, 12).join("-")}`;
        } else {
            return `words-${wordCount}-${words.slice(0, 12).join("-")}`;
        }
    }, [mode, time, wordCount, words]);
    if (gameState === "finished") {
        return (
            <Stats
                charHistory={charHistory}
                rawCharHistory={rawCharHistory}
                errors={errors}
                time={strategy.getTimerBehavior() === "countup" ? timer : time}
                mode={mode}
            />
        );
    }

    return (
        <>
            <GameHeader />
            <div className="flex flex-col items-center justify-start gap-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={getAnimationKey()}
                        className="flex flex-col items-center justify-start gap-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    >
                        {mode === "time" ? (
                            <TimeDisplay timer={timer} />
                        ) : (
                            <WordCountDisplay
                                count={typedWordCount}
                                target={words.length}
                            />
                        )}

                        <Typer
                            words={words}
                            startTyping={startTyping}
                            typedRef={typedRef}
                            incrementCps={incrementCps}
                            gameState={gameState}
                            onWordComplete={handleWordComplete}
                        />
                    </motion.div>
                </AnimatePresence>
                {isDevMode && (
                    <Button className="text-xl" onClick={handleSkipGame}>
                        Skip
                    </Button>
                )}
            </div>
        </>
    );
}
