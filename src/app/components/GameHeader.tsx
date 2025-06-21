"use client";

import { GameMode, useGameContext } from "@/context/gameContext";
import { cn } from "@/utils/cn";
import { Hourglass, Quote } from "lucide-react";
import { ReactNode } from "react";

type ModeDisplayType = {
    icon: ReactNode;
    mode: GameMode;
};

const GameHeader = () => {
    const { time, mode, handleGameMode, handleSetTime } = useGameContext();
    const timeSettings = [15, 30, 60, 120];

    const modes: ModeDisplayType[] = [
        {
            icon: <Hourglass size={16} />,
            mode: "time",
        },
        { icon: <Quote size={16} />, mode: "quote" },
    ];

    return (
        <div className="flex flex-row gap-2 w-2xl bg-[#292929] rounded-lg p-5 text-muted">
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
                    <span> {val}</span>
                </button>
            ))}
            <span>|</span>
            {timeSettings.map((val, i) => (
                <button
                    key={`time-${i}`}
                    className={cn(
                        "flex flex-row gap-2 items-center mx-2",
                        "hover:text-primary-foreground cursor-pointer duration-300",
                        time === val && "text-primary"
                    )}
                    onClick={() => handleSetTime(val)}
                >
                    {val}
                </button>
            ))}
        </div>
    );
};

export default GameHeader;
