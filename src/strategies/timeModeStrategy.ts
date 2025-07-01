import { GameModeStrategy } from "@/strategies/gameStrategies";
import { GameStateData } from "@/types/gameTypes";
import generateWords from "@/utils/wordGenerator";

export const createTimeModeStrategy = (
    duration: number = 30
): GameModeStrategy => ({
    initializeGame: () => ({
        initialTimer: duration,
        words: generateWords(180),
        targetMetric: "time",
    }),
    shouldEndGame: (state: GameStateData): boolean => state.timer <= 0,
    updateTimer: (currentTimer: number): number =>
        Math.max(0, currentTimer - 1),
    getTimerBehavior: (): "countdown" | "countup" | "disabled" => "countdown",
    onGameStart: (state: GameStateData): Partial<GameStateData> => ({
        timer: state.timer,
        typed: [],
        charHistory: [],
        rawCharHistory: [],
        errors: [],
        gameState: "running",
    }),
    onGameEnd: () => ({
        gameState: "finished",
    }),
});
