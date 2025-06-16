"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    DotProps,
    Line,
    Scatter,
    XAxis,
    YAxis,
} from "recharts";

type StatsProps = {
    charHistory: number[];
    rawCharHistory: number[];
    errors: number[];
};

const RenderErrorCross: FC<DotProps> = (props) => {
    const { cx, cy, payload } = props;
    const size = 2;

    if (!payload || !payload.error || !cx || !cy) {
        return null;
    }

    return (
        <g>
            <line
                x1={cx - size}
                y1={cy - size}
                x2={cx + size}
                y2={cy + size}
                stroke={"#ef4444"}
                strokeWidth={1.5}
            />
            <line
                x1={cx + size}
                y1={cy - size}
                x2={cx - size}
                y2={cy + size}
                stroke={"#ef4444"}
                strokeWidth={1.5}
            />
        </g>
    );
};
export default function Stats({
    charHistory,
    rawCharHistory,
    errors,
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

    const config = {
        rawWpm: {
            label: "rawwpm",
        },
        wpm: {
            label: "wpm",
        },
        errors: {
            label: "errors",
        },
    } satisfies ChartConfig;

    return (
        <div className="min-w-[90%] flex flex-col items-start">
            <span className="text-4xl font-bold text-gray-400">
                wpm {calculateWpm(correctCharCount, 30)}
            </span>
            <span className="text-4xl font-bold text-gray-400">
                acc {Math.round(accuracy * 10000) / 100} %
            </span>
            <ChartContainer config={config} className="h-[300px] w-[100%]">
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickMargin={10} />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        dataKey="error"
                    />

                    <Area
                        yAxisId="left"
                        dataKey="rawWpm"
                        type={"natural"}
                        stroke="#7e7e7e"
                        fill="#3f3f3f"
                        strokeWidth={2}
                    />
                    <Line
                        yAxisId="left"
                        dataKey="wpm"
                        type={"natural"}
                        fill="#FF9900"
                        stroke="#FF9900"
                        strokeWidth={3}
                        dot={{ strokeWidth: 1 }}
                    />
                    <Scatter
                        yAxisId="right"
                        dataKey={"error"}
                        fill="#ef4444"
                        shape={<RenderErrorCross />}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        label={"aaa"}
                    />
                </ComposedChart>
            </ChartContainer>
            <div className="flex flex-row gap-10 justify-center">
                <div className="flex flex-col">
                    <span className="font text-xl">Raw :</span>
                    <span className="font-bold text-4xl text-accent">
                        {charCount}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font text-xl">Consistency :</span>
                    <span className="font-bold text-4xl text-accent">
                        {calcConsistency(rawCharHistory)} %
                    </span>
                </div>
            </div>
        </div>
    );
}
