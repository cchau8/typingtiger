import localFont from "next/font/local";

export const neueRegrade = localFont({
    src: [
        {
            path: "../../public/font/NeueRegrade-Light.otf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/font/NeueRegrade-LightItalic.otf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/font/NeueRegrade-Regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/font/NeueRegrade-RegularItalic.otf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/font/NeueRegrade-Medium.otf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/font/NeueRegrade-MediumItalic.otf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/font/NeueRegrade-Semibold.otf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/font/NeueRegrade-SemiboldItalic.otf",
            weight: "600",
            style: "italic",
        },
        {
            path: "../../public/font/NeueRegrade-Bold.otf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/font/NeueRegrade-SemiboldItalic.otf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/font/NeueRegrade-ExtraBoldItalic.otf", // Note: No ExtraBold non-italic in screenshot
            weight: "800",
            style: "italic",
        },
    ],
    variable: "--font-neue-regrade",
    display: "swap",
});
