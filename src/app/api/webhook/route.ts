// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";
import * as crypto from 'crypto';
import { buffer } from 'micro';


const SECRET_KEY = process.env.LEMONSQUEEZY_SECRET_KEY;

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

        // Проверка подписи вебхука
        if (!verifySignature(req)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
        }

        const event = JSON.parse(body);


        if (event.event === 'checkout.completed') {

            const { customer, subscription } = event.data;

            console.log(subscription, customer)

            if (subscription && subscription.plan_name === 'Vip') {

                const user = await prisma.user.findUnique({
                    where: { email: customer.email }, // Или можно искать по другому идентификатору
                });

                if (user) {

                    await prisma.user.update({
                        where: { email: customer.email },
                        data: { isVip: true },
                    });

                    console.log('User is now VIP:', customer.email);
                }
            }
        }

        return new NextResponse(JSON.stringify({ message: 'Webhook processed successfully' }), { status: 200 });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
