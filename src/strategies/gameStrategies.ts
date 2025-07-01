import {
    GameConfig,
    GameEndConditionData,
    GameStateData,
} from "@/types/gameTypes";

export interface GameModeStrategy {
    initializeGame(): GameConfig;
    shouldEndGame(state: GameEndConditionData): boolean;
    updateTimer(currentTimer: number): number;
    getTimerBehavior(): "countdown" | "countup" | "disabled";
    onGameStart?(state: GameStateData): Partial<GameStateData>;
    onGameEnd?(state: GameStateData): Partial<GameStateData>;
}
