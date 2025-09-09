'use client'
import React, { useState } from 'react'
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {Box, Search, Settings, Sparkles, Lock, FoldersIcon, CrownIcon, SunMoonIcon} from "lucide-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
export const testimonials = [
    {
        quote: "Buildify — это лучший инструмент для создания сайтов. Я смог легко создать проект за считанные дни. Интерфейс интуитивно понятный, а возможности безграничны.",
        name: "Алексей Иванов",
        title: "Создатель сайта для стартапа",
    },
    {
        quote: "Раньше я использовал разные платформы, но Buildify — это что-то особенное. Быстрая настройка и мощные функции для работы с сайтом.",
        name: "Мария Кузнецова",
        title: "Веб-разработчик",
    },
    {
        quote: "Мой бизнес теперь растёт благодаря сайту, созданному на Buildify. Это действительно инструмент, который делает жизнь проще.",
        name: "Дмитрий Павлов",
        title: "Основатель онлайн-магазина",
    },
    {
        quote: "После того как я перешёл на Buildify, процесс разработки сайта стал гораздо быстрее. Особенно понравилась интеграция с платежными системами.",
        name: "Екатерина Смирнова",
        title: "Маркетолог и веб-дизайнер",
    },
    {
        quote: "Работаю с Buildify на протяжении нескольких месяцев. Очень доволен результатом. Платформа с отличной поддержкой и регулярными обновлениями.",
        name: "Иван Гусев",
        title: "Фрилансер-разработчик",
    },
];
const Page = () => {



    return (
        <div>
            <NavbarDemo />

            <BackgroundBeamsWithCollision>
                <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    Давайте узнаем о Buildify получше!
                    <br/>
                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">

                        <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-primary/30 via-primary/50 to-primary/80 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                            <span className="">Это интересно.</span>
                        </div>
                        <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary/30 via-primary/50 to-primary/80 py-4">
                            <span className="">Это интересно.</span>
                        </div>
                    </div>
                </h2>
            </BackgroundBeamsWithCollision>

            <GlowingEffectDemo />
            <div className="h-[40rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>
            <Footer />
        </div>
    );
}

export default Page;

export function GlowingEffectDemo() {
    return (
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Делайте все правильно"
                description="Время не ждет, делайте все быстро и правильно."
            />

            <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Лучший редактор кода с ИИ"
                description="Действительно крутой инструмент для создания сайта с поддержкой ИИ."
            />

            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Buildify Pro — для настоящих профессионалов"
                description="Полный доступ к уникальным инструментам и функциям."
            />

            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Этот инструмент построен для профессионалов"
                description="Buildify — лучший выбор для профессионалов в веб-разработке."
            />

            <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
                title="Скоро будет доступно на Buildify"
                description="У нас всегда есть что-то новенькое, следите за новыми обновлениями!"
            />
        </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                                {title}
                            </h3>
                            <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export function NavbarDemo() {

    return (
        <div className="relative w-full flex items-center justify-center">

            <Navbar className="top-2" />
        </div>
    );
}

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const {logout, user} = useAuth()
    const router = useRouter()
    const {theme, setTheme} = useTheme()
    return (
        <div
            className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
        >
            <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Услуги">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/">Создать сайт</HoveredLink>
                        <HoveredLink href="/">Смотреть статистику</HoveredLink>
                        <HoveredLink href="/pricing">Купить подписку</HoveredLink>
                        <HoveredLink href="/my-projects">Собрать коллекцию проектов</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Продукты">
                    <div className="text-sm grid grid-cols-2 gap-10 p-4">
                        <ProductItem
                            title="Главная"
                            href="/"
                            src="/photo-demo-1.png"
                            description="Главная страница, с которой ты точно уже познакомился."
                        />
                        <ProductItem
                            title="Мастерская"
                            href="/"
                            src="/photo-demo-3.png"
                            description="Это сердце создания наших сайтов! Здесь вы увидите много интересного об ИИ."
                        />
                        <ProductItem
                            title="FAQ"
                            href="/faq"
                            src="/phot-demo-2.png"
                            description="Убедись, что посетил эту страницу!"
                        />
                        <ProductItem
                            title="О нас"
                            href="/about-us"
                            src="/photo-demo-4.png"
                            description="Узнай о нас немного больше, чем знал до этого!"
                        />
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Цены">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="https://buildify-ru.lemonsqueezy.com/buy/8ca3801b-abf8-48cb-ad88-1bb031225890">Приобрести сейчас</HoveredLink>
                        <HoveredLink href="/pricing">Оплата</HoveredLink>
                        <HoveredLink href="/faq">FAQ</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Ссылки" >
                    <div className="flex justify-between px-4 mt-3 items-center">


                        <div className='flex flex-col gap-4'>



                                    <Button onClick={() => router.push('/my-projects')}>
                                        <FoldersIcon/>
                                        Мои проекты
                                    </Button>
                                    <Button onClick={() => router.push('/pricing')}>
                                        <CrownIcon/>
                                        Подписка Pro
                                    </Button>

                                    <Button onClick={() => {
                                        logout();
                                        router.push('/sign-up');
                                        toast.success('Вы вышли!');
                                    }}>
                                        Выйти
                                    </Button>





                        </div>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
