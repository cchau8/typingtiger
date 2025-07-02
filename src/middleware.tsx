import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    console.log("middleware hit:", request.nextUrl.pathname);
    console.log("token:", token);

    if (!token) {
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
