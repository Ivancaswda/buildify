import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from 'zod'
import prisma from "@/lib/db";
import {inngest} from "@/inngest/client";
import {TRPCError} from "@trpc/server";

export const messagesRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(
            z.object({
                projectId: z.string().min(1, {message: "Project ID is required"})
            })
        )
        .query(async  ({input,ctx}) => {
        const messages = await prisma.message.findMany({
            where: {
                projectId: input.projectId,
                project: {
                    userId: ctx.userId
                }
            },
            include: {
                fragment: true
            },
            orderBy: {
                updatedAt: 'asc'
            }
        })
        return messages!
    }),
    create: protectedProcedure.input(
            z.object({
                value: z.string()
                    .min(1, {message: 'value is required'})
                    .max(10000, {message: 'Value is too long'}),
                projectId: z.string().min(1, {message: "Project ID is required"}),

            })
        ).mutation(async ({input, ctx}) => {
            const existingProject = await prisma.project.findUnique({
                where: {
                    id: input.projectId,
                    userId: ctx.userId
                }
            })
        if (!existingProject) {
            throw  new TRPCError({code: 'NOT_FOUND', message: 'Project not found'})
        }

            const newMessage = await prisma.message.create({
                data: {
                    projectId: existingProject.id,
                    content: input.value,
                    role: 'USER',
                    type: 'RESULT'
                }
            })
            await inngest.send({
                name: 'website-builder/run',
                data: {
                    value: input.value,
                    projectId: input.projectId
                }
            })

            return newMessage
        })

})