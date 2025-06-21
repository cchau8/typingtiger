"use client";
import GithubIcon from "@/components/auth/GithubIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function AuthButtons() {
    // const { data: session } = useSession();

    return (
        <Button onClick={() => signIn("github")} className="text-lg">
            <GithubIcon /> Sign in with github
        </Button>
    );
}
