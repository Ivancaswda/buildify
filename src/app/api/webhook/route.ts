// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";
import * as crypto from 'crypto';
import { buffer } from 'micro';


const SECRET_KEY = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};



export async function POST(req: NextRequest) {
    try {

        let event;
        try {
            event = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const eventName = event?.meta?.event_name;
        const email = event?.data?.attributes?.user_email;
        const status = event?.data?.attributes?.status;
        if (!email || !eventName) {
            return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
        }
        // Проверяем событие и статус
        if (
            (eventName === "order_created" || eventName === "order_paid") &&
            status === "paid"
        ) {




                const user = await prisma.user.findUnique({
                    where: { email: email },
                });

                if (user) {
                    console.log("User found:", user);
                    await prisma.user.update({
                        where: { email: email },
                        data: { isVip: true },
                    });

                } else {
                    console.log('User not found:', email);
                }

        }

        return new NextResponse(JSON.stringify({ message: 'Webhook processed successfully' }), { status: 200 });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}

