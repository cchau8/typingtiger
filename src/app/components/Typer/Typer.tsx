"use client";

import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
    RefObject,
} from "react";
import Word from "@/app/components/Word";
import { motion } from "motion/react";
import Caret from "@/app/components/Typer/Caret";
import TyperInput from "@/app/components/Typer/TyperInput";
import { useCaretPosition } from "@/app/components/Typer/useCaretPosition";
import {
    DEFAULT_GAP_HEIGHT,
    DEFAULT_LINE_HEIGHT,
    LINES_VISIBLE,
} from "@/app/components/Typer/constants";

interface TyperProps {
    words: string[];
    startTyping: () => void;
    typedRef: RefObject<string[]>;
    incrementCps: (charTyped: string, char: string) => void;
    gameState?: "idle" | "running" | "finished";
    onWordComplete: () => void;
}

export default function Typer({
    words,
    startTyping,
    incrementCps,
    typedRef,
    gameState = "idle",
    onWordComplete,
}: TyperProps) {
    const [currentInput, setCurrentInput] = useState<string>("");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const lineHeightRef = useRef<number>(0);

    let globalCharOffset = 0;

    const { caretStyle, scrollOffset } = useCaretPosition({
        currentInput,
        currentIndex,
        charRefs,
        wordsContainerRef,
        words,
        lineHeightRef,
        typedRef,
    });

    // Calculate container height
    const containerHeight = useMemo(() => {
        const height =
            lineHeightRef.current > 0
                ? lineHeightRef.current
                : DEFAULT_LINE_HEIGHT + DEFAULT_GAP_HEIGHT;
        return height * LINES_VISIBLE;
    }, []);

    const toggleInputFocus = (val: boolean) => {
        setIsFocused(val);
    };

    /**
     * Function to force focus on the hidden input
     */
    const setInputFocus = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    /**
     * Handle input change
     * Will register the stroke in the stats and handle the flow of words
     * @param e
     */
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            // Trigger start typing on first char typed
            if (
                value.length > 0 &&
                currentIndex === 0 &&
                currentInput.length === 0
            ) {
                startTyping();
            }

            // FOR STATS
            // If there is a new char
            if (value.length > currentInput.length) {
                const typedChar = value[value.length - 1];
                let expectedChar = "";

                // If the input is equal to the length of the word we expect a space
                // Else we expect the same char
                if (value.length === words[currentIndex].length + 1) {
                    expectedChar = " ";
                } else if (value.length <= words[currentIndex].length) {
                    expectedChar = words[currentIndex][value.length - 1];
                }

                incrementCps(typedChar, expectedChar);
            }

            // FOR GAME FLOW
            // If it is a space and if the value is not empty we move to the next word
            // Else we save the input in the state
            if (value.endsWith(" ")) {
                if (currentIndex === words.length) {
                    return;
                }
                const trimmedValue = value.trim();
                if (trimmedValue.length === 0) return;

                typedRef.current.push(trimmedValue);
                setCurrentIndex((prev) => prev + 1);
                setCurrentInput("");
                onWordComplete?.();
            } else {
                setCurrentInput(value);
            }
        },
        [
            currentIndex,
            currentInput.length,
            incrementCps,
            onWordComplete,
            startTyping,
            typedRef,
            words,
        ]
    );

    /**
     *
     * @param e
     */
    const handleBackspace = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Do not allow backspace
            // - if no precedent word
            // - if the current input has character (nothing to do besides the default function)
            //  handled in handleChange
            if (
                e.key !== "Backspace" ||
                currentInput.length > 0 ||
                currentIndex === 0
            ) {
                console.log("here");
                return;
            }

            e.preventDefault();

            // Do not allow backspace to the last word if it was typed correctly
            const lastTypedWord = typedRef.current[typedRef.current.length - 1];
            const expectedWord = words[typedRef.current.length - 1];

            if (lastTypedWord === expectedWord) {
                return;
            }

            // If the input is empty and there is a last word go back to it
            setCurrentInput(lastTypedWord);
            typedRef.current = typedRef.current.slice(0, -1);
            setCurrentIndex(currentIndex - 1);
        },
        [currentInput.length, currentIndex, typedRef, words]
    );

    // Force focus on the hidden input on laod
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Reset state when words change
    useEffect(() => {
        setCurrentInput("");
        setCurrentIndex(0);
        typedRef.current = [];
        charRefs.current = [];
        lineHeightRef.current = 0;
    }, [words, typedRef]);

    return (
        <div
            className="w-full flex items-center flex-col select-none overflow-hidden cursor-text"
            style={{ height: `${containerHeight}px` }}
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
                <Caret
                    style={caretStyle}
                    isFocused={isFocused}
                    shouldAnimate={
                        currentIndex === 0 &&
                        !currentInput &&
                        gameState === "idle"
                    }
                />

                {words.map((word, index) => {
                    const wordState =
                        index < currentIndex
                            ? "typed"
                            : index === currentIndex
                            ? "active"
                            : "pending";

                    const currentGlobalOffset = globalCharOffset;

                    if (wordState === "typed") {
                        globalCharOffset +=
                            typedRef.current[index]?.length || 0;
                    } else if (wordState === "active") {
                        globalCharOffset += Math.max(
                            word.length,
                            currentInput.length
                        );
                    } else {
                        globalCharOffset += word.length;
                    }

                    // Only render the 80 following words
                    if (index > currentIndex + 100) {
                        return null;
                    }

                    return (
                        <Word
                            key={`${index}-${word}`}
                            text={word}
                            state={wordState}
                            typedText={
                                wordState === "typed"
                                    ? typedRef.current[index] || ""
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
            <TyperInput
                inputRef={inputRef}
                currentInput={currentInput}
                handleBackspace={handleBackspace}
                handleChange={handleChange}
                toggleInputFocus={toggleInputFocus}
            />
        </div>
    );
}
