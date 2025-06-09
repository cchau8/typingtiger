import generateWords from "@/lib/randomizeWords";
import Typer from "@/app/home/components/typer";

export default async function Homepage() {
    const words = generateWords(42);
    return (
        <main className="w-screen h-screen flex justify-center items-center">
            <Typer words={words} />
        </main>
    );
}
