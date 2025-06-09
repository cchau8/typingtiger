"use client";

import { cn } from "@/lib/utils";

type WordProps = {
    text: string;
    typedText: string;
    state: "typed" | "active" | "pending";
    // NEW: Function to pass refs up to the parent
    onCharRef: (element: HTMLSpanElement | null, index: number) => void;
    // NEW: The global starting index for characters in this word
    globalCharOffset: number;
};

export default function Word({
    text,
    typedText,
    state,
    onCharRef,
    globalCharOffset,
}: WordProps) {
    // IF word not typed yet => grey
    if (state === "pending") {
        return (
            <div className={cn("text-gray-500")}>
                {text.split("").map((char, i) => (
                    <span key={i} className="border-l-2 border-transparent">
                        {char}
                    </span>
                ))}
            </div>
        );
    }

    if (state === "typed") {
        return (
            <div
                className={cn(
                    text !== typedText && "border-b-2 border-red-300"
                )}
            >
                {text.split("").map((char, index) => {
                    let charClassName = "";

                    if (char == typedText[index]) {
                        charClassName = "text-white";
                    } else if (index >= typedText.length) {
                        charClassName = "text-gray-500";
                    } else if (char !== typedText[index]) {
                        charClassName = "text-red-400";
                    }

                    return (
                        <span
                            key={index}
                            className={cn(
                                charClassName,
                                "border-l-2 border-transparent"
                            )}
                        >
                            {char}
                        </span>
                    );
                })}
                {typedText.length > text.length &&
                    typedText
                        .slice(text.length)
                        .split("")
                        .map((char, index) => {
                            return (
                                <span
                                    key={index}
                                    className={cn(
                                        "text-red-900",
                                        "border-l-2 border-transparent"
                                    )}
                                >
                                    {char}
                                </span>
                            );
                        })}
            </div>
        );
    }

    // Render for the ACTIVE word
    return (
        <div className="relative">
            {text.split("").map((char, index) => {
                let charClassName = "text-gray-500";

                if (char == typedText[index]) {
                    charClassName = "text-white";
                } else if (index >= typedText.length) {
                    charClassName = "text-gray-500";
                } else if (char !== typedText[index]) {
                    charClassName = "text-red-400";
                }

                return (
                    <span
                        key={index}
                        ref={(el) => onCharRef(el, globalCharOffset + index)}
                        className={cn(
                            charClassName,
                            "border-l-2 border-transparent"
                        )}
                    >
                        {char}
                    </span>
                );
            })}

            {typedText.length > text.length &&
                typedText
                    .slice(text.length)
                    .split("")
                    .map((extraChar, extraCharIndex) => (
                        <span
                            ref={(el) =>
                                onCharRef(
                                    el,
                                    globalCharOffset +
                                        text.length +
                                        extraCharIndex
                                )
                            }
                            key={extraCharIndex}
                            className="text-red-900 border-l-2 border-transparent"
                        >
                            {extraChar}
                        </span>
                    ))}
        </div>
    );
}
