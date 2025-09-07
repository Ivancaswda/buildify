import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export async function getCurrentUser() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const user = await getUserFromToken(token);
        return user!;
    } catch {
        return null;
    }
}
