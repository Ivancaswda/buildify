import prisma from "@/lib/db";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const createToken = (userId: string) =>
    jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as { userId: string };

export const registerUser = async (email: string, password: string, name?: string) => {
    const hashed = await hashPassword(password)

    const user = await prisma.user.create({ data: { email, password: hashed, name } });

    const token = createToken(user.id);
    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid password");
    const token = createToken(user.id);
    return { user, token };
};

export const getUserFromToken = async (token: string) => {
    try {
        const payload = verifyToken(token);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        return user!;
    } catch {
        return null;
    }
};
