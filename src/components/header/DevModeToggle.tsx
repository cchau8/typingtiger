"use client";

import { Button } from "@/components/ui/button";
import { useDevMode } from "@/hooks/useDevMode";
import { Boxes } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const DevModeToggle = () => {
    const { isDevMode, toggleDevMode, canUseDevMode } = useDevMode();
    if (!canUseDevMode) {
        return <></>;
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={toggleDevMode}
                    variant={isDevMode ? "default" : "ghost"}
                >
                    <Boxes />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>Toggle Dev Mode</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DevModeToggle;
