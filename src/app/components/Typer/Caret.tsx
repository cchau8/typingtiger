import { CaretStyle } from "@/types/gameTypes";
import { cn } from "@/utils/cn";

interface CaretProps {
    style: CaretStyle;
    isFocused: boolean; // When input is focused
    shouldAnimate: boolean; // For pulse animation
}

export default function Caret({ style, isFocused, shouldAnimate }: CaretProps) {
    return (
        <span
            className={cn(
                "absolute w-0.5 transition-colors duration-200 z-10",
                isFocused ? "bg-yellow-500" : "bg-gray-400",
                isFocused && shouldAnimate && "animate-pulse"
            )}
            style={{
                height: `${style.height}px`,
                top: `${style.top}px`,
                left: `${style.left}px`,
                opacity: style.opacity,
                transition:
                    "left 0.1s linear, top 0.1s linear, opacity 0.2s ease",
            }}
        />
    );
}
