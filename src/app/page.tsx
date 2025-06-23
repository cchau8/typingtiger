import GameInterface from "@/app/components/GameInterface";

export default function Home() {
    return (
        <main className="mx-auto flex flex-col max-w-[90%] h-[70vh] items-center gap-60">
            <GameInterface />
        </main>
    );
}
