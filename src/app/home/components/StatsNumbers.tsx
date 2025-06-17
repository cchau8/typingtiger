import { useMemo } from "react";

type StatsNumberProps = {
    charCount: number;
    consistency: number;
    time?: number;
};

export default function StatsNumber({
    charCount,
    consistency,
    time = 30,
}: StatsNumberProps) {
    const data = useMemo(() => {
        return [
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
