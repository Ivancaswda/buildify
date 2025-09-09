'use client'
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Компонент кнопки из вашего UI
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";
import {ArchiveIcon, Contact2Icon, FolderIcon, ListIcon} from "lucide-react";

const Footer = () => {
    const { user } = useAuth();

    return (
        <footer className="bg-primary text-white p-8 mt-20">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Логотип и информация о компании */}
                <div className="flex flex-col items-start">
                    <Image src="/logo2.png" alt="Buildify Logo" width={120} height={120} className="object-contain" />
                    <p className="font-semibold text-lg mt-4">Buildify - Ваш инструмент для создания сайтов</p>
                    <p className="text-sm mt-2">
                        Сделано с любовью для {user?.name || "пользователей"}!
                    </p>
                </div>

                {/* Ссылки на страницы */}
                <div className="flex flex-col items-start">
                    <h4 className="font-semibold text-lg mb-4">Ресурсы</h4>
                    <Link href="/docs">
                        <Button variant="link" className="text-sm text-white hover:text-neutral-500  mb-2">
                            <ArchiveIcon/>
                            Документация</Button>
                    </Link>
                    <Link href="/contact-us">
                        <Button variant="link" className="text-sm text-white hover:text-neutral-500 mb-2">
                            <Contact2Icon/>
                            Контакты</Button>
                    </Link>
                    <Link href="/about-us">
                        <Button variant="link" className="text-sm text-white hover:text-neutral-500  mb-2">
                            <ListIcon/>
                            О нас</Button>
                    </Link>
                </div>

                {/* Социальные сети и подписка */}
                <div className="flex flex-col items-start">
                    <h4 className="font-semibold text-lg mb-4">Социальные сети</h4>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-neutral-500  mb-2">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-neutral-500  mb-2">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-neutral-500  mb-2">Instagram</a>

                    {/* Кнопка подписки */}
                    <Button variant="ghost" className="mt-6 px-6 py-2 bg-black! text-white! text-sm rounded-lg">
                        Подписаться на новости
                    </Button>
                </div>
            </div>

            {/* Нижняя часть футера */}
            <div className="mt-8 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Buildify. Все права защищены.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
