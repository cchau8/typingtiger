"use client";

import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";

const GoToGameButton = () => {
    const router = useRouter();
    return (
        <Button onClick={() => router.push("/")} variant={"ghost"} size={"lg"}>
            <Keyboard />
        </Button>
    );
};

export default GoToGameButton;
