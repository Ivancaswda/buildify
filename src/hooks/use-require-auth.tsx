
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function useRequireAuth(redirectToIfLogged: string, redirectToIfGuest: string) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (user) {

            if (redirectToIfLogged) router.push(redirectToIfLogged);
        } else {

            if (redirectToIfGuest) router.push(redirectToIfGuest);
        }
    }, [user, loading, router, redirectToIfLogged, redirectToIfGuest]);

    return { user, loading };
}
