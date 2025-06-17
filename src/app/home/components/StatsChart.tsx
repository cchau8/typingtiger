import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import ErrorCross from "@/components/ui/errorCross";

import {
    Area,
    CartesianGrid,
    ComposedChart,
    Label,
    Line,
    Scatter,
    XAxis,
    YAxis,
} from "recharts";

type ChartData = {
    time: number;
    rawWpm: number;
    wpm: number;
    error: number | null;
};

type StatsChartProps = {
    data: ChartData[];
};

export default function StatsChart({ data }: StatsChartProps) {
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
        <ChartContainer config={config} className="h-[300px] w-[100%]">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickMargin={10}>
                    <Label
                        value={"time"}
                        offset={0}
                        style={{ marginTop: 100 }}
                        position={"centerBottom"}
                    ></Label>
                </XAxis>
                <YAxis yAxisId="left" orientation="left" label={"wpm"} />
                <YAxis yAxisId="right" orientation="right" dataKey="error" />

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
                    shape={<ErrorCross />}
                />
                <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={() => null}
                />
            </ComposedChart>
        </ChartContainer>
    );
}
