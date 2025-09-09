import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, userName, avatarUrl } = body;

        if (!email) {
            return NextResponse.json({ error: "Missing email" }, { status: 400 });
        }

        // ищем юзера по email
        let user = await prisma.user.findUnique({
            where: { email },
        });

        // если нет — создаём нового
        if (!user) {
            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name: userName,
                    password: tempPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    avatarUrl
                },
            });
        }


        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // ответ
        const res = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });

        // кука
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error: any) {
        console.error("failed to login via google", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
