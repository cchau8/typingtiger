import localFont from "next/font/local";

export const neueRegrade = localFont({
    src: [
        {
            path: "../../public/font/Neue Regrade Light Font.otf", // Adjust path based on this file's location
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/font/Neue Regrade Light Italic Font.otf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../public/font/Neue Regrade Regular Font.otf",
            weight: "400", // 'normal' is often an alias for 400
            style: "normal",
        },
        {
            path: "../../public/font/Neue Regrade Regular Italic.otf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../public/font/Neue Regrade Medium Font.otf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/font/Neue Regrade Medium Italic Font.otf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../public/font/Neue Regrade Semibold Font.otf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/font/Neue Regrade Semibold Italic Font.otf",
            weight: "600",
            style: "italic",
        },
        {
            path: "../../public/font/Neue Regrade Bold Free Font.otf", // Assuming 'Bold Free Font' is your standard bold
            weight: "700", // 'bold' is often an alias for 700
            style: "normal",
        },
        {
            path: "../../public/font/Neue Regrade Bold Italic Font.otf",
            weight: "700",
            style: "italic",
        },
        {
            path: "../../public/font/Neue Regrade ExtraBold Italic Font.otf", // Note: No ExtraBold non-italic in screenshot
            weight: "800", // 'extrabold'
            style: "italic", // Or normal if you have a non-italic version
        },
        // Add other weights/styles as needed
    ],
    variable: "--font-neue-regrade", // Optional: for CSS variable usage
    display: "swap", // Optional: affects font loading behavior
});
