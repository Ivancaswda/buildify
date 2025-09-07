import { createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from 'zod'
import prisma from "@/lib/db";
import {inngest} from "@/inngest/client";
import {generateSlug} from "random-word-slugs";
import {TRPCError} from "@trpc/server";

const adjectives = [
    "красивый", "умный", "сильный", "мудрый", "яркий", "спокойный", "зеленый", "голубой",
    "светлый", "злой", "добрый", "веселый", "плавный", "мощный", "молниеносный", "чистый",
    "гладкий", "прекрасный", "крепкий", "дружелюбный", "яркий", "теплый", "смешной", "страшный"
];

// Список существительных
const nouns = [
    "лес", "горы", "река", "море", "озеро", "вулкан", "песок", "дождь", "снег", "ветер",
    "град", "камень", "свет", "пламя", "поток", "облако", "океан", "пещера", "дерево",
    "планета", "океан", "солнце", "звезда", "луна", "грозы", "поле", "пустыня"
];

// Функция для генерации слэга (прилагательное-сущность)
function generateRussianSlug() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}-${randomNoun}`;
}


export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({
        id: z.string().min(1, {message: 'Id is required'}),
    }))
        .query(async ({input,ctx}) => {


            const existingProject = await prisma.project.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.userId

                }
            })
            if (!existingProject) {
                throw new TRPCError({code: 'NOT_FOUND', message: 'Project not found'})
            }
            return existingProject!
        })
    ,
    getMany: protectedProcedure.query(async  ({input, ctx}) => {
const projects = await prisma.project.findMany({
            where: {
              userId: ctx.userId
            },
            orderBy: {
                updatedAt: 'asc'
            }
        })
        return projects!
    }),
    create: protectedProcedure.input(
            z.object({
                value: z.string()
                    .min(1, {message: 'Value is required'})
                    .max(1000, {message: 'Value is too long'})
            })
        ).mutation(async ({input, ctx}) => {

            const createdProject = await prisma.project.create({
                data: {
                    userId: ctx.userId,
                    name: generateRussianSlug(),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: 'RESULT'
                        }
                    }
                }
            })


            await inngest.send({
                name: 'website-builder/run',
                data: {
                    value: input.value,
                    projectId: createdProject.id,
                    userId: ctx.userId
                }
            })

            return createdProject
        })

})