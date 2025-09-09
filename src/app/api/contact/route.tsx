// /src/app/api/sendComplaint/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { category, message, userEmail } = body;

    if (!category || !message) {
        return NextResponse.json({ error: "Category and message required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,  // пароль приложения
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        width: 80%;
                        margin: 20px auto;
                    }
                    h1 {
                        color: #4CAF50;
                        font-size: 24px;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .category {
                        background-color: #f1f1f1;
                        padding: 8px;
                        border-radius: 4px;
                    }
                    .message-box {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-left: 4px solid #4CAF50;
                        margin-top: 10px;
                        font-style: italic;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Жалоба от пользователя</h1>
                    <p><span class="label">Категория:</span> <span class="category">${category}</span></p>
                    <p><span class="label">Почта пользователя:</span> ${userEmail || "Не указана"}</p>
                    <div class="message-box">
                        <p><span class="label">Сообщение:</span></p>
                        <p>${message}</p>
                    </div>
                    <div class="footer">
                        <p>Письмо отправлено через систему Buildify</p>
                    </div>
                </div>
            </body>
        </html>
    `;


    try {
        await transporter.sendMail({
            from: `"Buildify" <${process.env.YANDEX_EMAIL}>`,
            to: process.env.SUPPORT_EMAIL,
            subject: `Жалоба: ${category}`,
            html: htmlContent

        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ошибка при отправке:", error);
        return NextResponse.json({ error: "Ошибка при отправке письма" }, { status: 500 });
    }
}
