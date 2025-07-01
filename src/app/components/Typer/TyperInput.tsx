import { useGameContext } from "@/context/gameContext";
import { ChangeEvent, RefObject } from "react";

interface TyperInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    currentInput: string;
    handleBackspace: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleInputFocus: (val: boolean) => void;
}

const TyperInput = ({
    inputRef,
    currentInput,
    handleBackspace,
    handleChange,
    toggleInputFocus,
}: TyperInputProps) => {
    const { gameState } = useGameContext();
    return (
        <input
            className="opacity-0 absolute pointer-events-none"
            value={currentInput}
            onChange={handleChange}
            ref={inputRef}
            onKeyDown={handleBackspace}
            onFocus={() => toggleInputFocus(true)}
            onBlur={() => toggleInputFocus(false)}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={gameState === "finished"}
        />
    );
};

export default TyperInput;
