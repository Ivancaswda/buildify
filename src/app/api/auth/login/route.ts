import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    try {
        const { user, token } = await loginUser(email, password);
        const res = NextResponse.json({ user });
        res.cookies.set("token", token, { httpOnly: true, path: "/" });
        return res;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
