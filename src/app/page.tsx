import GameHeader from "@/app/components/GameHeader";
import GameInterface from "@/app/components/GameInterface";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center gap-60">
            <GameHeader />
            <GameInterface />
        </main>
    );
}
