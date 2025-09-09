'use client'
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CrownIcon, FoldersIcon, SunMoonIcon} from "lucide-react";
import {toast} from "sonner";
import {useAuth} from "@/hooks/use-auth";
import {useTheme} from "next-themes";
import {useRouter} from "next/navigation";

export default function ContactPage() {
    const [category, setCategory] = useState("Ошибка");
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter()
    const [status, setStatus] = useState("");
    const {user, logout} = useAuth()
    const {theme, setTheme} = useTheme()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Отправка...");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, message, userEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("✅ Спасибо! Обращение отправлено.");
                setCategory("Ошибка");
                setMessage("");
                setUserEmail("");
            } else {
                setStatus(`❌ Ошибка: ${data.error || "Не удалось отправить"}`);
            }
        } catch (error) {
            setStatus("❌ Ошибка сети. Попробуйте позже.");
        }
    };

    const selectTypeOfComplaint = ['Ошибка', 'Вопрос', 'Предложение', 'Другое'];

    return (
        <>

            <div className="flex justify-between px-4 my-3 items-center">
                <Link href='/'>
                    <Image className="hidden md:block rounded-xl"
                           width={70} height={70}
                           alt='logo'
                           src='/logo2.png' />
                </Link>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user?.avatarUrl} />
                                <AvatarFallback className="bg-primary text-white">
                                    {user?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.push('/my-projects')}>
                                <FoldersIcon/>
                                Мои проекты
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/pricing')}>
                                <CrownIcon/>
                                Подписка Pro
                            </DropdownMenuItem>
                            {/* Dropdown для тем */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex  gap-1 px-2 text-sm items-center">
                                    <SunMoonIcon className='size-xs text-gray-500' />
                                    <span>Темы</span>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        Светлая
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')} >
                                        Темная
                                    </DropdownMenuItem>


                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuItem onClick={() => {
                                logout();
                                router.push('/sign-up');
                                toast.success('Вы вышли!');
                            }}>
                                Выйти
                            </DropdownMenuItem>


                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
            <section className="min-h-screen  py-20 px-4">
                <div className="max-w-2xl mx-auto  border border-gray-200 rounded-xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-primary text-center mb-6">
                        Обратная связь
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <Label className=" block mb-1">
                                Тип обращения
                            </Label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                    <SelectValue placeholder="Выберите тип..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectTypeOfComplaint.map((s, i) => (
                                        <SelectItem value={s} key={i}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="email" className=" block mb-1">
                                Email (необязательно)
                            </Label>
                            <input
                                type="email"
                                id="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <Label htmlFor="message" className=" block mb-1">
                                Сообщение
                            </Label>
                            <textarea
                                id="message"
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                placeholder="Опишите вашу проблему или предложение..."
                                className="w-full p-3 rounded-lg border border-gray-300 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-all duration-300"
                        >
                            Отправить
                        </button>

                        {status && (
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {status}
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </>
    );
}
