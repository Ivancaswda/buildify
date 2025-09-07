import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json();
    console.log(email, password, name)
    try {
        const { user, token } = await registerUser(email, password, name);
        const res = NextResponse.json({ user });
        res.cookies.set("token", token, { httpOnly: true, path: "/" });
        return res;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
