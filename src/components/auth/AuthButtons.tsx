"use client";
import GithubIcon from "@/components/auth/GithubIcon";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function AuthButtons() {
    // const { data: session } = useSession();

    return (
        <div className="w-full flex flex-row gap-2 ">
            <Button
                onClick={() => signIn("gmail")}
                className="text-lg grow cursor-pointer"
                variant={"outline"}
            >
                <GoogleIcon />
            </Button>
            <Button
                onClick={() => signIn("github")}
                className="text-lg grow cursor-pointer"
                variant={"outline"}
            >
                <GithubIcon />
            </Button>
        </div>
    );
}
