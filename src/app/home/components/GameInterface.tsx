"use client";

import Stats from "@/app/home/components/Stats";
import Time from "@/app/home/components/Time";
import Typer from "@/app/home/components/Typer";
import { useCallback, useEffect, useRef, useState } from "react";

type GameInterfaceProps = {
    words: string[];
};

type GameState = "idle" | "running" | "finished";

// const defaultCharHistory = [
//     8, 8, 0, 4, 2, 6, 6, 5, 0, 7, 4, 2, 6, 7, 6, 7, 4, 4, 5, 6, 5, 4, 3, 3, 3,
//     6, 7, 5, 3, 2,
// ];
// const defaultRawCharHistory = [
//     10, 9, 4, 5, 3, 7, 8, 7, 5, 8, 6, 3, 8, 8, 8, 8, 5, 5, 6, 7, 6, 5, 4, 4, 4,
//     7, 8, 6, 5, 3,
// ];
// const defaultErrors = [
//     0, 0, 4, 0, 1, 0, 0, 2, 4, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0,
//     0, 0, 0, 1, 0,
// ];
// const defaultWpm = 82;

export default function GameInterface({ words }: GameInterfaceProps) {
    const [gameState, setGameState] = useState<GameState>("idle");
    const [timer, setTimer] = useState<number>(30);
    const [typed, setTyped] = useState<string[]>([]);
    const [rawCharHistory, setRawCharHistory] = useState<number[]>([]);
    const [charHistory, setCharHistory] = useState<number[]>([]);
    const [errors, setErrors] = useState<number[]>([]);

    const rawCpsRef = useRef(0);
    const cpsRef = useRef(0);
    const errorsPerSecondRef = useRef(0);
    const [liveWpm, setLiveWpm] = useState<number>(0);
    // const [finalWpm, setFinalWpm] = useState<number>(0);

    const startTyping = useCallback(() => {
        setGameState("running");
        setTyped([]);
    }, []);

    // const resetGame = () => {
    //     setTimer(30);
    //     setLiveWpm(0);
    //     setCps(0);
    //     setCharHistory([]);
    //     setFinalWpm(0);
    // };

    const calculateWpm = (charCount: number, seconds: number) => {
        if (seconds === 0 || charCount === 0) {
            return 0;
        }
        const wordsTyped = charCount / 5;
        const minutes = seconds / 60;
        return Math.round(wordsTyped / minutes);
    };

    const incrementCps = useCallback((charTyped: string, char: string) => {
        // if (gameState === "running") {
        rawCpsRef.current += 1;
        console.log(charTyped, char);
        if (charTyped === char) {
            cpsRef.current += 1;
        } else {
            errorsPerSecondRef.current += 1;
        }
    }, []);

    useEffect(() => {
        // Check if game is running
        if (gameState != "running") {
            return;
        }
        // Countdown to decrement timer every second and :
        // - add character count each seconds
        // - update live wpm
        // On finish => set game to finish
        const countdown = setInterval(() => {
            const currentCps = cpsRef.current;
            const currentRawCps = rawCpsRef.current;
            const currentErrors = errorsPerSecondRef.current;
            setLiveWpm(calculateWpm(currentCps, 1));
            setRawCharHistory((prevHistory) => [...prevHistory, currentRawCps]);
            setCharHistory((prevHistory) => [...prevHistory, currentCps]);
            setErrors((prevErrors) => [...prevErrors, currentErrors]);
            rawCpsRef.current = 0; // Reset counter for the next second
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

    // useEffect(() => {
    //     if (gameState === "finished") {
    //         const totalChars = rawCharHistory.reduce(
    //             (sum, count) => sum + count,
    //             0
    //         );

    //         setFinalWpm(calculateWpm(totalChars, 30));
    //     }
    // }, [gameState, rawCharHistory]);

    if (gameState === "finished") {
        // console.log(finalWpm);
        console.log(rawCharHistory);
        console.log(charHistory);
        console.log(errors);

        return (
            <Stats
                charHistory={charHistory}
                rawCharHistory={rawCharHistory}
                errors={errors}
            />
        );
    }

    return (
        <div className=" flex flex-col min-w-3xl  justify-center items-center gap-20">
            <Time timer={timer} />
            <Typer
                words={words}
                startTyping={startTyping}
                typed={typed}
                setTyped={setTyped}
                incrementCps={incrementCps}
            />
            <span className="text-4xl font-bold text-gray-400">
                {liveWpm} wpm
            </span>
        </div>
    );
}
