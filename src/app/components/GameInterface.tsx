"use client";

import Stats from "@/app/components/Stats";
import Time from "@/app/components/Time";
import Typer from "@/app/components/Typer";
import { useGameContext } from "@/context/gameContext";
import generateWords from "@/utils/wordGenerator";
import speeches from "@/lib/data/speeches.json";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDevMode } from "@/hooks/useDevMode";
import { Button } from "@/components/ui/button";

type GameState = "idle" | "running" | "finished";

const defaultCharHistory = [
    8, 8, 0, 4, 2, 6, 6, 5, 0, 7, 4, 2, 6, 7, 6, 7, 4, 4, 5, 6, 5, 4, 3, 3, 3,
    6, 7, 5, 3, 2,
];
const defaultRawCharHistory = [
    10, 9, 4, 5, 3, 7, 8, 7, 5, 8, 6, 3, 8, 8, 8, 8, 5, 5, 6, 7, 6, 5, 4, 4, 4,
    7, 8, 6, 5, 3,
];
const defaultErrors = [
    0, 0, 4, 0, 1, 0, 0, 2, 4, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 1, 0,
];

export default function GameInterface() {
    const { mode, time, resetTrigger } = useGameContext();
    const { isDevMode } = useDevMode();
    const [gameState, setGameState] = useState<GameState>("idle");
    const [timer, setTimer] = useState<number>(time);
    const [typed, setTyped] = useState<string[]>([]);
    const [rawCharHistory, setRawCharHistory] = useState<number[]>([]);
    const [charHistory, setCharHistory] = useState<number[]>([]);
    const [errors, setErrors] = useState<number[]>([]);
    const [words, setWords] = useState<string[]>([]);
    const rawCpsRef = useRef(0);
    const cpsRef = useRef(0);
    const errorsPerSecondRef = useRef(0);
    const [skipGame, setSkipGame] = useState<boolean>(false);

    const startTyping = useCallback(() => {
        setGameState("running");
        setTyped([]);
    }, []);

    const resetGame = useCallback(() => {
        setGameState("idle");
        setTimer(time);
        setTyped([]);
        setCharHistory([]);
        setRawCharHistory([]);
        setErrors([]);
    }, [time]);

    const handleSkipGame = () => {
        setSkipGame(true);
    };

    const incrementCps = useCallback((charTyped: string, char: string) => {
        rawCpsRef.current += 1;
        if (charTyped === char) {
            cpsRef.current += 1;
        } else {
            errorsPerSecondRef.current += 1;
        }
    }, []);

    useEffect(() => {
        if (mode == "time") {
            const newWords = generateWords(180);
            setWords(newWords);
        } else if (mode == "quote") {
            const random = Math.floor(Math.random() * speeches.length);
            const newWords = speeches[random].value.split(" ");
            setWords(newWords);
        }
    }, [mode, time, resetTrigger]);

    useEffect(() => {
        if (gameState !== "running") {
            setTimer(time);
        }
    }, [gameState, time]);

    useEffect(() => {
        if (skipGame) {
            setGameState("finished");
        }
    }, [skipGame]);

    useEffect(() => resetGame(), [resetGame, resetTrigger]);

    useEffect(() => {
        // Check if game is running
        if (gameState != "running") {
            return;
        }
        // Countdown to decrement timer every second and :
        // - add character count each seconds
        // On finish => set game to finish
        const countdown = setInterval(() => {
            const currentCps = cpsRef.current;
            const currentRawCps = rawCpsRef.current;
            const currentErrors = errorsPerSecondRef.current;

            setRawCharHistory((prevHistory) => [...prevHistory, currentRawCps]);
            setCharHistory((prevHistory) => [...prevHistory, currentCps]);
            setErrors((prevErrors) => [...prevErrors, currentErrors]);

            // Reset counter for the next second
            rawCpsRef.current = 0;
            cpsRef.current = 0;
            errorsPerSecondRef.current = 0;

            setTimer((prevTimer) => {
                const newTime = prevTimer - 1;
                if (newTime <= 0) {
                    setGameState("finished");
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [gameState]);

    if (gameState === "finished") {
        return (
            <Stats
                charHistory={skipGame ? defaultCharHistory : charHistory}
                rawCharHistory={
                    skipGame ? defaultRawCharHistory : rawCharHistory
                }
                errors={skipGame ? defaultErrors : errors}
            />
        );
    }

    return (
        <div className=" flex flex-col max-w-[90%] justify-center items-center gap-20">
            <Time timer={timer} />
            <Typer
                words={words}
                startTyping={startTyping}
                typed={typed}
                setTyped={setTyped}
                incrementCps={incrementCps}
            />
            {isDevMode && (
                <Button className="text-xl" onClick={handleSkipGame}>
                    Skip
                </Button>
            )}
        </div>
    );
}
