"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
    return <Header />;
}
