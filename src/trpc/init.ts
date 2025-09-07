import {initTRPC, TRPCError} from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";
import {getCurrentUser} from "@/lib/currentUser";
export const createTRPCContext = cache(async () => {
    const user = await getCurrentUser()
    return { userId: user?.id };
});
export  type Context = Awaited<ReturnType<typeof createTRPCContext>>
const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});

const isAuthed = t.middleware(({next, ctx}) => {
    if (!ctx.userId) {
        throw  new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated'
        })
    }
    return next({
        ctx: {
            userId: ctx.userId
        }
    })
})
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed)