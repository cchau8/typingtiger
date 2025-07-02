// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "USER" | "ADMIN";
        } & DefaultSession["user"];
    }
    interface User extends DefaultUser {
        role: string;
    }
}
