"use client";

import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/gameContext";
import { Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";

const GoToGameButton = () => {
    const router = useRouter();
    const { resetGame } = useGameContext();
    return (
        <Button
            onClick={() => {
                resetGame();
                router.push("/");
            }}
            variant={"ghost"}
            size={"lg"}
        >
            <Keyboard />
        </Button>
    );
};

export default GoToGameButton;
