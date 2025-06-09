"use client";

import {
    ChangeEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import Word from "@/app/home/components/word";

type TyperProps = {
    words: string[];
};

export default function Typer({ words }: TyperProps) {
    const [currentInput, setCurrentInput] = useState<string>("");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [typed, setTyped] = useState<string[]>([]);
    const [isReverting, setIsReverting] = useState(false);

    const [caretStyle, setCaretStyle] = useState({
        top: 0,
        left: 0,
        height: 0,
        opacity: 0,
    });

    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

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

        setCaretStyle({
            top: newTop,
            left: newLeft,
            opacity: 1,
            height: newHeight,
        });
    }, [currentInput, currentIndex, typed]);

    useEffect(() => {
        if (isReverting) setIsReverting(false);
    }, [isReverting]);

    let globalCharOffset = 0;

    return (
        <div
            className="w-full flex items-center flex-col select-none"
            onClick={setInputFocus}
        >
            <div
                ref={wordsContainerRef}
                className="relative flex gap-x-3 gap-y-4 max-w-4xl flex-wrap text-3xl tracking-wider font-mono justify-center"
            >
                <span
                    className="absolute h-full w-0.5 bg-yellow-500"
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

                    // Increment offset for the next word. Use the typed length for accuracy.
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
            </div>
            <input
                className="opacity-0 absolute"
                value={currentInput}
                onChange={handleChange}
                ref={inputRef}
                onKeyDown={handleBackspace}
            />
        </div>
    );
}
