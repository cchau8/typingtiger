export type GameState = "idle" | "running" | "finished";
export type GameMode = "time" | "words" | "quote";

export interface GameConfig {
    initialTimer: number;
    words: string[];
    targetMetric: "time" | "words" | "completion";
}

export interface GameEndConditionData {
    timer: number;
    typed: string[];
    gameState: GameState;
    wordCount: number;
    words: string[];
}

export interface GameStateData extends GameEndConditionData {
    charHistory: number[];
    rawCharHistory: number[];
    errors: number[];
}

export interface CaretStyle {
    top: number;
    left: number;
    height: number;
    opacity: number;
}
