"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <Button variant={"ghost"} onClick={() => signOut()}>
            <LogOut />
        </Button>
    );
}
