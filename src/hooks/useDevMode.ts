import { useState, useEffect } from "react";

export const useDevMode = () => {
    const [isDevMode, setIsDevMode] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Vérifie si le mode dev est activé en environnement
        const devModeEnabled =
            process.env.NEXT_PUBLIC_DEV_MODE_ENABLED === "true";

        if (devModeEnabled) {
            // Récupère l'état depuis localStorage
            const savedDevMode = localStorage.getItem("dev-mode") === "true";
            setIsDevMode(savedDevMode);
        }

        setIsHydrated(true);
    }, []);
    const toggleDevMode = () => {
        if (process.env.NEXT_PUBLIC_DEV_MODE_ENABLED === "true") {
            const newState = !isDevMode;
            setIsDevMode(newState);
            localStorage.setItem("dev-mode", String(newState));
        }
    };

    return {
        isDevMode: isHydrated ? isDevMode : false, // Force false pendant l'hydratation
        toggleDevMode,
        canUseDevMode: process.env.NEXT_PUBLIC_DEV_MODE_ENABLED === "true",
    };
};
