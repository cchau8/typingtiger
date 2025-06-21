import { FC } from "react";
import { DotProps } from "recharts";

interface CustomDotProps extends DotProps {
    // The 'payload' object is passed by Recharts and contains the data for that point.
    // We define its shape here. 'error' can be any type, e.g., boolean.
    payload?: {
        error?: boolean;
    };
}

const ErrorCross: FC<CustomDotProps> = (props) => {
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

export default ErrorCross;
