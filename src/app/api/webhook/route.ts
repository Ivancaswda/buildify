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

const verifySignature = (req: NextRequest) => {
    const signature = req.headers.get('x-lemonsqueezy-signature');
    if (!signature) return false;
    return signature === crypto
        .createHmac('sha256', SECRET_KEY)
        .update(req.body)
        .digest('hex');
};

export async function POST(req: NextRequest) {
    try {
        const buf = await buffer(req);
        const body = buf.toString();

        console.log("Received body:", body); // Логирование тела запроса

        if (!verifySignature(req)) {
            console.log("Invalid signature");
            return new NextResponse(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
        }

        const event = JSON.parse(body);

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
            const { subscription } = event.data;


            if (subscription && subscription.plan_name === 'Vip') {
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
        }

        return new NextResponse(JSON.stringify({ message: 'Webhook processed successfully' }), { status: 200 });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}

