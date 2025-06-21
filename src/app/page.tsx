import GameHeader from "@/app/components/GameHeader";
import GameInterface from "@/app/components/GameInterface";
import generateWords from "@/utils/wordGenerator";

export default function Home() {
    const words = generateWords(42);

    return (
        <main className="flex flex-col justify-center items-center">
            <GameHeader />
            <GameInterface words={words} />
        </main>
    );
}
