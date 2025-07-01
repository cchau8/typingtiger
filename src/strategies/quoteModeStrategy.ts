import { GameModeStrategy } from "@/strategies/gameStrategies";
import speeches from "@/lib/data/speeches.json";

const getRandomSpeech = () => {
    console.log(speeches);
    const rand = Math.floor(Math.random() * speeches.length);
    const randomSpeech = speeches[rand];

    return randomSpeech.value.split(" ");
};

export const createQuoteModeStrategy = (): GameModeStrategy => ({
    initializeGame: () => ({
        initialTimer: 0,
        words: getRandomSpeech(),
        targetMetric: "time",
    }),
    shouldEndGame: (state) => {
        const wordCount = state.words.length;
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
    updateTimer: (currentTimer) => currentTimer + 1,
    getTimerBehavior: () => "countup",
    onGameStart: () => ({
        timer: 0,
        gameState: "running",
    }),
    onGameEnd: () => ({
        gameState: "finished",
    }),
});
