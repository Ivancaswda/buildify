'use client';
import React, {useEffect, useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {LoaderThree} from "@/components/ui/loader";
import {useAuth} from "@/hooks/use-auth";
import {IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans} from "@tabler/icons-react";
import {signInWithPopup} from "firebase/auth";
import {auth, provider} from "@/lib/firebase";
import {toast} from "sonner";

function SignInPage() {
    const { user, loading:userLoading, setUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        const body = {
            email: email,
            password: password,
        };

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Sign in failed");

            toast.success("Вы успешно вошли!");

            router.replace('/')
            router.refresh()
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        try {

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    userName: user.displayName,
                    avatarUrl: user.photoURL
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка входа");

            setUser(data.user);
            localStorage.setItem("token", data.token);

            router.push("/");
            toast.success("Успешный вход через Google!");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (user ) {
            router.replace("/");
        }
    }, [user, router]);

    if (userLoading) {
        return (
            <div className="flex items-center justify-center w-full h-screen gap-4">
                <LoaderThree />
                <p className="text-primary">Загрузка...</p>
            </div>
        );
    }
    return (
        <div className='flex items-center justify-center w-full h-screen '>
            <div className="mx-auto w-full  max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-black">
                <h2 className="text-2xl font-bold text-primary">Вход</h2>
                <p className="mt-2 text-sm text-muted-foreground">Введите данные для входа</p>

                <form className="my-8 space-y-4" onSubmit={handleSubmit}>
                    <LabelInputContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                            required
                            className="rounded-xl"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            required
                            className="rounded-xl"
                        />
                    </LabelInputContainer>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        className="w-full rounded-xl bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary/90 transition-all"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Входим..." : "Войти"}
                    </button>

                    <p className="mt-2 text-sm text-center">
                        Впервые у нас?{" "}
                        <span
                            onClick={() => router.push("/sign-up")}
                            className="cursor-pointer text-primary hover:underline"
                        >
            Зарегистрироваться
          </span>
                    </p>

                    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                    <div className="flex flex-col gap-3">
                        <button onClick={handleGoogleSignIn}
                                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900"
                                type="button"
                        >
                            <IconBrandGoogle />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
                            <BottomGradient />
                        </button>



                    </div>
                </form>
            </div>

        </div>
    );
      }

const SocialButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <button
        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900"
        type="button"
    >
        {icon}
        <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
        <BottomGradient />
    </button>
);

const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default SignInPage;
