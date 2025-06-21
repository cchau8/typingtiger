"use client";

import { GameProvider } from "@/context/gameContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <GameProvider>{children}</GameProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
