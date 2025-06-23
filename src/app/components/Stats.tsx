"use client";

import StatsChart from "@/app/components/StatsChart";
import StatsNumber from "@/app/components/StatsNumbers";

type StatsProps = {
    charHistory: number[];
    rawCharHistory: number[];
    errors: number[];
    time?: number;
};

export default function Stats({
    charHistory,
    rawCharHistory,
    errors,
    time,
}: StatsProps) {
    const charCount = rawCharHistory.reduce((el, acc) => (acc += el));
    const correctCharCount = charHistory.reduce((el, acc) => (acc += el));
    const errorCount = errors.reduce((el, acc) => (acc += el));

    const accuracy = correctCharCount / (correctCharCount + errorCount);
    const calculateWpm = (charCount: number, seconds: number) => {
        if (seconds === 0 || charCount === 0) {
            return 0;
        }
        const wordsTyped = charCount / 5;
        const minutes = seconds / 60;
        return Math.round(wordsTyped / minutes);
    };

    const calcConsistency = (history: number[]) => {
        const meanAvg =
            history.reduce((el, acc) => (acc += el)) / history.length;
        const variance =
            history
                .map((el) => (el - meanAvg) ** 2)
                .reduce((el, acc) => (acc += el)) / history.length;
        const standardVariation = Math.sqrt(variance);
        const coeffVariation = standardVariation / meanAvg;

        return Math.round((1 - coeffVariation) * 100 * 100) / 100;
    };

    const data = rawCharHistory.map((el, i) => {
        return {
            time: i + 1,
            rawWpm: calculateWpm(el, 1),
            wpm: calculateWpm(
                charHistory.slice(0, i + 1).reduce((el, acc) => (acc += el)),
                i + 1
            ),
            error: errors[i] > 0 ? errors[i] : null,
        };
    });

    return (
        <div className="min-w-[90%] flex flex-col items-start mt-[25vh]">
            <div className="flex flex-row w-full items-stretch gap-2">
                <div className="flex flex-col gap-5 ">
                    <div className="flex flex-col">
                        <span className="font text-2xl font-bold text-secondary">
                            wpm
                        </span>
                        <span className="font-bold text-5xl text-accent">
                            {calculateWpm(correctCharCount, 30)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font text-2xl font-bold text-secondary">
                            acc
                        </span>
                        <span className="font-bold text-5xl text-accent text-nowrap">
                            {Math.round(accuracy * 100)} %
                        </span>
                    </div>
                </div>
                <StatsChart data={data} />
            </div>

            <StatsNumber
                charCount={charCount}
                consistency={calcConsistency(rawCharHistory)}
                time={time}
            />
        </div>
    );
}
