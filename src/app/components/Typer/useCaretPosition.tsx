import {
    useLayoutEffect,
    useState,
    useCallback,
    useEffect,
    RefObject,
} from "react";
import { CaretStyle } from "@/types/gameTypes";
import { DEFAULT_LINE_HEIGHT } from "./constants";

interface UseCaretPositionParams {
    currentInput: string;
    currentIndex: number;
    charRefs: RefObject<(HTMLSpanElement | null)[]>;
    wordsContainerRef: RefObject<HTMLDivElement | null>;
    typedRef: RefObject<string[]>;
    words: string[];
    lineHeightRef: RefObject<number>;
}

interface UseCaretPositionReturn {
    caretStyle: CaretStyle;
    currentLine: number;
    scrollOffset: number;
}

export const useCaretPosition = ({
    currentInput,
    currentIndex,
    charRefs,
    wordsContainerRef,
    typedRef,
    words,
    lineHeightRef,
}: UseCaretPositionParams): UseCaretPositionReturn => {
    const [caretStyle, setCaretStyle] = useState<CaretStyle>({
        top: 0,
        left: 0,
        height: DEFAULT_LINE_HEIGHT * 0.6,
        opacity: 0,
    });
    const [currentLine, setCurrentLine] = useState<number>(0);
    const [scrollOffset, setScrollOffset] = useState<number>(0);

    const calculateCurrentLine = useCallback(
        (caretTop: number): number => {
            if (lineHeightRef.current === 0) return 0;
            return Math.floor(caretTop / lineHeightRef.current);
        },
        [lineHeightRef]
    );

    const updateScrollOffset = useCallback(
        (newLine: number) => {
            if (newLine <= 1) {
                setScrollOffset(0);
                return;
            }
            const targetScrollOffset = (newLine - 1) * lineHeightRef.current;
            setScrollOffset(targetScrollOffset);
        },
        [lineHeightRef]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            const firstChar = charRefs.current?.[0];
            if (firstChar) {
                const rect = firstChar.getBoundingClientRect();
                const container = wordsContainerRef.current;

                if (container && lineHeightRef.current === 0) {
                    lineHeightRef.current = rect.height + 16;
                }

                if (currentIndex === 0 && !currentInput && container) {
                    const containerRect = container.getBoundingClientRect();
                    setCaretStyle({
                        height: rect.height,
                        top: rect.top - containerRect.top,
                        left: rect.left - containerRect.left,
                        opacity: 1,
                    });
                }
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [
        words,
        currentIndex,
        currentInput,
        charRefs,
        wordsContainerRef,
        lineHeightRef,
    ]);

    useEffect(() => {
        if (charRefs.current?.[0] && currentIndex === 0 && !currentInput) {
            const container = wordsContainerRef.current;
            const firstChar = charRefs.current[0];

            if (container && firstChar) {
                const containerRect = container.getBoundingClientRect();
                const firstRect = firstChar.getBoundingClientRect();

                setCaretStyle(() => ({
                    height: firstRect.height,
                    top: firstRect.top - containerRect.top,
                    left: firstRect.left - containerRect.left,
                    opacity: 1,
                }));
            }
        }
    }, [charRefs.current?.[0], currentIndex, currentInput, words]);

    useLayoutEffect(() => {
        const container = wordsContainerRef.current;
        if (!container) return;

        if (lineHeightRef.current === 0 || !charRefs.current[0]) {
            setCaretStyle({
                height: 0,
                top: 0,
                left: 0,
                opacity: 0,
            });
        }

        // Calculate global character index
        let globalCharIndex = 0;
        for (let i = 0; i < currentIndex; i++) {
            globalCharIndex += typedRef.current?.[i]?.length || 0;
        }
        globalCharIndex += currentInput.length;

        const targetSpan = charRefs.current?.[globalCharIndex];
        const prevSpan = charRefs.current?.[globalCharIndex - 1];
        const containerRect = container.getBoundingClientRect();

        let newHeight = DEFAULT_LINE_HEIGHT * 0.6;
        let newLeft = 0;
        let newTop = 0;

        if (globalCharIndex === 0) {
            const firstChar = charRefs.current?.[0];
            if (firstChar) {
                const firstRect = firstChar.getBoundingClientRect();
                newTop = firstRect.top - containerRect.top;
                newHeight = firstRect.height;
                newLeft = firstRect.left - containerRect.left;
            } else {
                newTop = 0;
                newLeft = 0;
                newHeight = DEFAULT_LINE_HEIGHT * 0.6;
            }
        } else if (targetSpan) {
            const targetRect = targetSpan.getBoundingClientRect();
            newLeft = targetRect.left - containerRect.left;
            newTop = targetRect.top - containerRect.top;
            newHeight = targetRect.height;
        } else if (prevSpan) {
            const prevRect = prevSpan.getBoundingClientRect();
            newLeft = prevRect.right - containerRect.left;
            newTop = prevRect.top - containerRect.top;
            newHeight = prevRect.height;
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
    }, [
        currentInput,
        currentIndex,
        currentLine,
        calculateCurrentLine,
        updateScrollOffset,
        typedRef,
        words,
        charRefs.current?.length,
        wordsContainerRef,
        charRefs,
    ]);

    useEffect(() => {
        setScrollOffset(0);
        setCurrentLine(0);
        setCaretStyle({
            top: 0,
            left: 0,
            height: DEFAULT_LINE_HEIGHT * 0.6,
            opacity: 0.7,
        });
    }, [words]);

    return {
        caretStyle,
        currentLine,
        scrollOffset,
    };
};
