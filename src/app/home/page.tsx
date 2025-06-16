import generateWords from "@/lib/randomizeWords";
import GameInterface from "@/app/home/components/GameInterface";

export default async function Homepage() {
    const words = generateWords(42);
    return (
        <main className="w-screen h-screen flex justify-center items-center">
            <GameInterface words={words} />
        </main>
    );
}
