import dynamic from "next/dynamic";

const AuthButtons = dynamic(() => import("@/components/auth/AuthButtons"));

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-20 row-start-2 items-center">
                <h1 className="text-3xl">
                    Hi there, welcome to my mokeytype like app (everything here
                    is destined for practice only, feel free to play with it :)
                </h1>
                <div className="flex md:justify-between flex-col gap-5 md:w-[400px] sm:flex-row">
                    <AuthButtons />
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
        </div>
    );
}
