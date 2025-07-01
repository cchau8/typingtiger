import { cn } from "@/utils/cn";

interface GameSettingsProps {
    handleClick: (val: number) => void;
    selected: boolean;
    value: number;
}

const GameSettings = ({ handleClick, selected, value }: GameSettingsProps) => {
    return (
        <button
            className={cn(
                "flex flex-row gap-2 items-center mx-2",
                "hover:text-primary-foreground cursor-pointer duration-300",
                selected && "text-primary"
            )}
            onClick={() => handleClick(value)}
        >
            {value}
        </button>
    );
};

export default GameSettings;
