import { GameModeStrategy } from "@/strategies/gameStrategies";
import { GameEndConditionData } from "@/types/gameTypes";
import generateWords from "@/utils/wordGenerator";

export const createWordModeStrategy = (
    wordCount: number = 10
): GameModeStrategy => ({
    initializeGame: () => ({
        initialTimer: 0,
        words: generateWords(wordCount),
        targetMetric: "time",
    }),
    shouldEndGame: (state: GameEndConditionData) => {
        if (state.wordCount < wordCount) {
            return false;
        }
        if (state.wordCount === wordCount) {
            const lastTypedChar = state.typed[state.typed.length - 1].slice(-1);
            const lastTargetChar = state.words[wordCount - 1].slice(-1);
            return lastTypedChar === lastTargetChar;
        }
        return state.wordCount > wordCount;
    },
    updateTimer: (currentTimer: number) => currentTimer + 1,
    getTimerBehavior: () => "countup",
    onGameStart: () => ({
        timer: 0,
        gameState: "running",
    }),
    onGameEnd: () => ({
        gameState: "finished",
    }),
});
