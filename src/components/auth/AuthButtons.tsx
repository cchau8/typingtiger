"use client";
import GithubIcon from "@/components/auth/GithubIcon";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthButtons() {
    const { data: session } = useSession();

    if (session) {
        return redirect("/home");
    }
    return (
        <Button onClick={() => signIn("github")} className="text-lg">
            <GithubIcon /> Sign in with github
        </Button>
    );
}
