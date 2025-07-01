"use client";

import {
    timeSettings,
    wordCountSettings,
} from "@/app/components/Header/constants";
import GameSettings from "@/app/components/Header/GameSettings";
import { useGameContext } from "@/context/gameContext";
import { GameMode } from "@/types/gameTypes";
import { cn } from "@/utils/cn";
import { Hourglass, Quote, WholeWord } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useMemo } from "react";

type ModeDisplayType = {
    icon: ReactNode;
    mode: GameMode;
};

const GameHeader = () => {
    const {
        time,
        mode,
        wordCount,
        handleGameMode,
        handleSetTime,
        handleSetWordCount,
    } = useGameContext();

    const showExtraSettings = useMemo(() => mode !== "quote", [mode]);
    const modes: ModeDisplayType[] = [
        {
            mode: "time",
            icon: <Hourglass size={16} />,
        },
        { mode: "quote", icon: <Quote size={16} /> },
        {
            mode: "words",
            icon: <WholeWord size={20} />,
        },
    ];

    return (
        <div className="flex flex-row gap-2 bg-[#292929] rounded-lg p-5 text-muted">
            <div className="flex flex-row gap-2">
                {modes.map(({ mode: val, icon }, i) => (
                    <button
                        key={`mode-${i}`}
                        className={cn(
                            "flex flex-row gap-2 items-center mx-2",
                            "hover:text-primary-foreground cursor-pointer duration-300",
                            mode === val && "text-primary"
                        )}
                        onClick={() => handleGameMode(val)}
                    >
                        {icon}
                        <span>{val}</span>
                    </button>
                ))}
            </div>

            <div className="relative">
                <AnimatePresence mode="wait">
                    {showExtraSettings && (
                        <div className="flex flex-row gap-2">
                            <span className="border-2 border-muted rounded-xl " />

                            {mode === "time" && (
                                <motion.div
                                    key="time-settings"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                    }}
                                    className="flex flex-row gap-2"
                                >
                                    {timeSettings.map((val, i) => (
                                        <GameSettings
                                            handleClick={handleSetTime}
                                            key={`time-${i}`}
                                            value={val}
                                            selected={time === val}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {mode === "words" && (
                                <motion.div
                                    key="words-settings"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                    }}
                                    className="flex flex-row gap-2"
                                >
                                    {wordCountSettings.map((val, i) => (
                                        <GameSettings
                                            handleClick={handleSetWordCount}
                                            key={`wordcount-${i}`}
                                            value={val}
                                            selected={wordCount === val}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GameHeader;
