'use client'
import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { FaRegQuestionCircle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils";
import {useRouter} from "next/navigation";
import Footer from "@/components/Footer";

const Page = () => {
    const router = useRouter()
    return (
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-16">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-primary mb-8">Часто задаваемые вопросы (FAQ)</h1>
                <p className="text-lg text-muted-foreground mb-16">
                    Здесь вы найдете все важные вопросы и ответы о Buildify, оплате и поддержке.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <Accordion type="multiple">
                    {/* Вопрос 1 */}
                    <AccordionItem value="1">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Что такое Buildify?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                            Buildify — это мощная платформа для создания сайтов без необходимости кодирования. Мы предоставляем простые инструменты, которые позволяют быстро создавать функциональные сайты с помощью искуственного интелекта и различных готовых шаблонов.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Вопрос 2 */}
                    <AccordionItem value="2">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Как создать сайт с помощью Buildify?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                            Для создания сайта достаточно зарегистрироваться и сказать нашему искуственному интелекту каким вы хотите видеть ваш вебсайт и после порядка минуты ваш вебсайт будет готов который будет существовать 1 час!
                        </AccordionContent>
                    </AccordionItem>

                    {/* Вопрос 3 */}
                    <AccordionItem value="3">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Как осуществляется оплата через LemonSqueezy?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                            Оплата через LemonSqueezy является безопасным и удобным способом совершить покупку подписки. После выбора тарифа вы сможете оплатить через доступные методы, такие как банковская карта или PayPal, и сразу же получить доступ к премиум-услугам.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Вопрос 4 */}
                    <AccordionItem value="4">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Как отменить подписку?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                           После внесения средств вы не сможете ее отменить после одного месяц, потом просто не пополняйте счет и все!
                        </AccordionContent>
                    </AccordionItem>

                    {/* Вопрос 5 */}
                    <AccordionItem value="5">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Как связаться с поддержкой?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                            Вы можете обратиться в нашу службу поддержки через раздел "Контакты" на сайте. Мы отвечаем на все запросы в течение 24 часов и всегда рады помочь вам решить проблемы, связанные с использованием Buildify.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Вопрос 6 */}
                    <AccordionItem value="6">
                        <AccordionTrigger className={cn('text-xl font-semibold p-4', 'hover:bg-gray-100 dark:hover:bg-gray-700')}>
                            <FaRegQuestionCircle className="mr-3 text-primary" />
                            Какие преимущества VIP подписки?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">
                            VIP подписка открывает вам доступ к  приоритетной поддержке, а также неограниченным возможностям по созданию сайтов. Включает дополнительные функции, такие как интеграции с API и многое другое.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Кнопка с призывом к действию */}
            <div className="text-center mt-12">
                <Button onClick={() => router.push('/about-us')} className="px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors">
                    Узнать больше
                </Button>
            </div>

        </div>
    )
}

export default Page
