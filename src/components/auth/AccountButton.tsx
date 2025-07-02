"use client";

import AuthButtons from "@/components/auth/AuthButtons";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CircleUser, LogInIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const AccountButton = () => {
    const { data: session } = useSession();

    if (session) {
        return <LogoutButton />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <CircleUser />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="flex flex-row gap-2 items-center text-xl">
                    <LogInIcon /> <span>login</span>
                </DialogTitle>
                <AuthButtons />
            </DialogContent>
        </Dialog>
    );
};

export default AccountButton;
