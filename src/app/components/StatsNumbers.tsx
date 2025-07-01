import { GameMode } from "@/types/gameTypes";
import { useMemo } from "react";

type StatsNumberProps = {
    charCount: number;
    consistency: number;
    time?: number;
    mode: GameMode;
};

export default function StatsNumber({
    charCount,
    consistency,
    time = 30,
    mode,
}: StatsNumberProps) {
    const data = useMemo(() => {
        return [
            {
                label: "mode",
                value: mode,
            },
            {
                label: "raw",
                value: charCount,
            },
            {
                label: "consistency",
                value: consistency,
            },
            {
                label: "time",
                value: `${time}s`,
            },
        ];
    }, [charCount, consistency, time]);
    return (
        <div className="flex flex-row gap-10 justify-center">
            {data.map(({ label, value }, i) => (
                <div className="flex flex-col" key={`data-${i}`}>
                    <span className="font text-xl">{label}</span>
                    <span className="font-bold text-4xl text-accent">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
}
