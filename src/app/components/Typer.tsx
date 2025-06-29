"use client";

import {
    ChangeEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import Word from "@/app/components/Word";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";

type TyperProps = {
    words: string[];
    startTyping: () => void;
    typed: string[];
    setTyped: (val: string[]) => void;
    incrementCps: (charTyped: string, char: string) => void;
};

export default function Typer({
    words,
    startTyping,
    typed,
    setTyped,
    incrementCps,
}: TyperProps) {
    const [currentInput, setCurrentInput] = useState<string>("");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isReverting, setIsReverting] = useState(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [scrollOffset, setScrollOffset] = useState<number>(0);
    const [currentLine, setCurrentLine] = useState<number>(0);

    const [caretStyle, setCaretStyle] = useState({
        top: 0,
        left: 0,
        height: 0,
        opacity: 0,
    });

    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const lineHeightRef = useRef<number>(0);

    useEffect(() => {
        const firstChar = charRefs.current[0];
        if (firstChar && lineHeightRef.current === 0) {
            const rect = firstChar.getBoundingClientRect();
            lineHeightRef.current = rect.height + 16;
        }
    }, [charRefs.current[0]]);

    const calculateCurrentLine = (caretTop: number): number => {
        if (lineHeightRef.current === 0) return 0;
        return Math.floor(caretTop / lineHeightRef.current);
    };

    const updateScrollOffset = (newLine: number) => {
        if (newLine <= 1) {
            setScrollOffset(0);
            return;
        }
        const targetScrollOffset = (newLine - 1) * lineHeightRef.current;
        setScrollOffset(targetScrollOffset);
    };

    useEffect(() => {
        return () => {
            // Clear refs on unmount
            wordsContainerRef.current = null;
        };
    }, []);

    useEffect(() => {
        setCurrentInput("");
        setCurrentIndex(0);
        setTyped([]);
        setScrollOffset(0);
        setCaretStyle({
            top: 0,
            left: 0,
            height: 0,
            opacity: 0,
        });
    }, [words, setTyped]);

    const setInputFocus = () => {
        inputRef.current?.focus();
    };

    /**
     * Function to handle the use of backspace in typer
     * If the character is not backspace, do nothing
     *
     * If the current input is not empty, do nothing
     *
     * If the current input is empty, and we are not on the first word
     *  it should set the current input to the previous word and index to the last char
     * @param e
     * @returns void
     */
    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Backspace") {
            return;
        }
        if (currentInput.length === 0 && currentIndex > 0) {
            e.preventDefault();

            const lastTypedWord = typed[typed.length - 1];
            if (lastTypedWord === words[typed.length - 1]) {
                return;
            }
            setIsReverting(true);

            setCurrentInput(lastTypedWord);
            setTyped(typed.slice(0, -1));
            setCurrentIndex(currentIndex - 1);
        }
    };

    /**
     * Function to handle the hidden input change
     *
     * If the value is a space then it should move to the next word
     *
     * Else it should set the value
     *
     * @param e
     * @returns void
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (currentInput.length > 0 && currentIndex == 0) {
            startTyping();
        }

        if (value.length >= currentInput.length) {
            let compare: string = "";
            if (value.length === words[currentIndex].length + 1) {
                compare = " ";
            } else if (value.length <= words[currentIndex].length) {
                compare = words[currentIndex][value.length - 1];
            }
            incrementCps(value[value.length - 1], compare);
        }

        if (value.endsWith(" ")) {
            if (value.trim().length === 0) return;

            setTyped([...typed, value.trim()]);
            setCurrentIndex(currentIndex + 1);
            setCurrentInput("");
        } else {
            setCurrentInput(value);
        }
    };

    useLayoutEffect(() => {
        const container = wordsContainerRef.current;
        if (!container) return;

        // Calculate the "flat" index of the caret across all characters
        let globalCharIndex = 0;
        for (let i = 0; i < currentIndex; i++) {
            globalCharIndex += typed[i].length;
        }
        globalCharIndex += currentInput.length;

        // Find the target span element using the global index
        const targetSpan = charRefs.current[globalCharIndex];
        const prevSpan = charRefs.current[globalCharIndex - 1];
        const containerRect = container.getBoundingClientRect();

        let newHeight = 0;
        let newLeft = 0;
        let newTop = 0;

        if (targetSpan) {
            // Position caret at the left of the next character
            const targetRect = targetSpan.getBoundingClientRect();
            newLeft = targetRect.left - containerRect.left;
            newTop = targetRect.top - containerRect.top;
            newHeight = targetRect.height;
        } else if (prevSpan) {
            // If at the end of a line or text, position after the last character
            const prevRect = prevSpan.getBoundingClientRect();
            newLeft = prevRect.right - containerRect.left;
            newTop = prevRect.top - containerRect.top;
            newHeight = prevRect.height;
        }

        // Handle the very first character case
        if (globalCharIndex === 0) {
            const firstChar = charRefs.current[0];
            if (firstChar) {
                const firstRect = firstChar.getBoundingClientRect();
                newTop = firstRect.top - containerRect.top;
                newHeight = firstRect.height;
            }
        }

        const newLine = calculateCurrentLine(newTop);
        if (newLine !== currentLine) {
            setCurrentLine(newLine);
            updateScrollOffset(newLine);
        }

        setCaretStyle({
            height: newHeight,
            top: newTop,
            left: newLeft,
            opacity: 1,
        });
    }, [currentInput, currentIndex, typed, currentLine]);

    useEffect(() => {
        if (isReverting) setIsReverting(false);
    }, [isReverting]);

    let globalCharOffset = 0;

    // useEffect(() => {}, [currentIndex, currentInput, startTyping]);

    return (
        <div
            className={
                "w-full flex items-center flex-col select-none overflow-hidden"
            }
            style={{
                height:
                    lineHeightRef.current > 0
                        ? `${lineHeightRef.current * 3}px`
                        : "192px",
            }}
            onClick={setInputFocus}
        >
            <motion.div
                animate={{ y: -scrollOffset }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3,
                }}
                ref={wordsContainerRef}
                className="relative flex gap-x-3 gap-y-4 max-w-[80%] flex-wrap text-3xl tracking-wider font-mono justify-center"
            >
                <span
                    className={cn(
                        "absolute h-full w-0.5 bg-gray-500",
                        isFocused && "bg-yellow-500",
                        isFocused &&
                            currentIndex === 0 &&
                            !currentInput &&
                            "animate-pulse"
                    )}
                    style={{
                        ...caretStyle,
                        transition: isReverting
                            ? "none"
                            : "left 0.1s linear, top 0.1s linear",
                    }}
                ></span>
                {words.map((word, index) => {
                    const wordState =
                        index < currentIndex
                            ? "typed"
                            : index === currentIndex
                            ? "active"
                            : "pending";
                    const currentGlobalOffset = globalCharOffset;

                    if (wordState === "typed") {
                        globalCharOffset += typed[index].length;
                    } else if (wordState === "active") {
                        globalCharOffset += Math.max(
                            word.length,
                            currentInput.length
                        );
                    } else {
                        globalCharOffset += word.length;
                    }

                    return (
                        <Word
                            key={index}
                            text={word}
                            state={wordState}
                            typedText={
                                wordState === "typed"
                                    ? typed[index]
                                    : wordState === "active"
                                    ? currentInput
                                    : ""
                            }
                            onCharRef={(el, charIndex) => {
                                charRefs.current[charIndex] = el;
                            }}
                            globalCharOffset={currentGlobalOffset}
                        />
                    );
                })}
            </motion.div>
            <input
                className="opacity-0 absolute"
                value={currentInput}
                onChange={handleChange}
                ref={inputRef}
                onKeyDown={handleBackspace}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="off"
            />
        </div>
    );
}
