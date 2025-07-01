import { useCallback, useRef, useState } from "react";

// Default data for skip game functionality
const DEFAULT_STATS = {
    charHistory: [
        8, 8, 0, 4, 2, 6, 6, 5, 0, 7, 4, 2, 6, 7, 6, 7, 4, 4, 5, 6, 5, 4, 3, 3,
        3, 6, 7, 5, 3, 2,
    ],
    rawCharHistory: [
        10, 9, 4, 5, 3, 7, 8, 7, 5, 8, 6, 3, 8, 8, 8, 8, 5, 5, 6, 7, 6, 5, 4, 4,
        4, 7, 8, 6, 5, 3,
    ],
    errors: [
        0, 0, 4, 0, 1, 0, 0, 2, 4, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
        0, 0, 0, 0, 1, 0,
    ],
} as const;

interface GameStats {
    charHistory: number[];
    rawCharHistory: number[];
    errors: number[];
}

interface CurrentSecondStats {
    correctChars: number;
    totalChars: number;
    errors: number;
}

const createEmptyStats = (): GameStats => ({
    charHistory: [],
    rawCharHistory: [],
    errors: [],
});

const createEmptySecondStats = (): CurrentSecondStats => ({
    correctChars: 0,
    totalChars: 0,
    errors: 0,
});

export const useGameStats = () => {
    const [stats, setStats] = useState<GameStats>(createEmptyStats);
    const [skipGame, setSkipGame] = useState<boolean>(false);

    // Current second counters
    const currentSecondStats = useRef<CurrentSecondStats>(
        createEmptySecondStats()
    );

    // Historical data (avoid re-renders during game)
    const statsHistory = useRef<GameStats>(createEmptyStats());

    const incrementCps = useCallback(
        (charTyped: string, expectedChar: string) => {
            if (!charTyped || !expectedChar) return;

            const current = currentSecondStats.current;
            current.totalChars += 1;

            if (charTyped === expectedChar) {
                current.correctChars += 1;
            } else {
                current.errors += 1;
            }
        },
        []
    );

    const recordSecond = useCallback(() => {
        const current = currentSecondStats.current;
        const history = statsHistory.current;

        // Record this second's stats
        history.charHistory.push(current.correctChars);
        history.rawCharHistory.push(current.totalChars);
        history.errors.push(current.errors);

        if (process.env.NODE_ENV === "development") {
            console.log(
                `Second ${history.charHistory.length}: ${current.correctChars}/${current.totalChars} chars, ${current.errors} errors`
            );
        }

        // Reset counters for next second
        current.correctChars = 0;
        current.totalChars = 0;
        current.errors = 0;
    }, []);

    const finalizeStats = useCallback(() => {
        const history = statsHistory.current;
        setStats({
            charHistory: [...history.charHistory],
            rawCharHistory: [...history.rawCharHistory],
            errors: [...history.errors],
        });
    }, []);

    const resetStats = useCallback(() => {
        // Reset state
        setStats(createEmptyStats());

        // Reset refs
        currentSecondStats.current = createEmptySecondStats();
        statsHistory.current = createEmptyStats();

        setSkipGame(false);
    }, []);

    const handleSkipGame = useCallback(() => {
        setStats({
            charHistory: [...DEFAULT_STATS.charHistory],
            rawCharHistory: [...DEFAULT_STATS.rawCharHistory],
            errors: [...DEFAULT_STATS.errors],
        });
        setSkipGame(true);
    }, []);

    // Computed values for easier access
    const currentWPM =
        stats.charHistory.length > 0
            ? Math.round(
                  (stats.charHistory[stats.charHistory.length - 1] / 5) * 60
              )
            : 0;

    const averageWPM =
        stats.charHistory.length > 0
            ? Math.round(
                  (stats.charHistory.reduce((sum, chars) => sum + chars, 0) /
                      stats.charHistory.length /
                      5) *
                      60
              )
            : 0;

    const totalErrors = stats.errors.reduce((sum, err) => sum + err, 0);
    const accuracy =
        stats.rawCharHistory.length > 0
            ? Math.round(
                  ((stats.rawCharHistory.reduce(
                      (sum, chars) => sum + chars,
                      0
                  ) -
                      totalErrors) /
                      stats.rawCharHistory.reduce(
                          (sum, chars) => sum + chars,
                          0
                      )) *
                      100
              )
            : 100;

    return {
        // Raw stats
        charHistory: stats.charHistory,
        rawCharHistory: stats.rawCharHistory,
        errors: stats.errors,

        // Computed stats
        currentWPM,
        averageWPM,
        totalErrors,
        accuracy,

        // Actions
        incrementCps,
        recordSecond,
        resetStats,
        handleSkipGame,
        skipGame,
        finalizeStats,
    };
};
