"use client";
import React, {useEffect, useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans,} from "@tabler/icons-react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/use-auth";
import {LoaderThree} from "@/components/ui/loader";
import {useRequireAuth} from "@/hooks/use-require-auth";

function SignUpPage() {
    const { user, loading:userLoading } = useRequireAuth("/", "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Signup failed");

            toast.success("✅ Successfully signed up! You can now login.");
            setName("");
            setEmail("");
            setPassword("");
            router.push('/')
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    console.log(user)
    useEffect(() => {
        if (user && !userLoading) {
            router.push('/')
        }
    }, [user, userLoading, router])
    if (userLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full gap-4">
                <LoaderThree />
                <p className="text-orange-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to Aceternity
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Create your account below
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id="name"
                        placeholder="Tyler"
                        type="text"
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Электронная почта</Label>
                    <Input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        id="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-6">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                </LabelInputContainer>

                {error && (
                    <p className="mb-4 text-sm text-red-500">{error}</p>
                )}

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md dark:bg-zinc-800"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up →"}
                    <BottomGradient />
                </button>

                <p className='mt-2 text-sm'>Уже есть аккаунт? <span onClick={() => router.push('/sign-in')} className='text-orange-600 cursor-pointer hover:text-orange-700 transition-all '>Войти</span></p>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <SocialButton icon={<IconBrandGithub />} label="GitHub" />
                    <SocialButton icon={<IconBrandGoogle />} label="Google" />
                    <SocialButton icon={<IconBrandOnlyfans />} label="OnlyFans" />
                </div>
            </form>
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

export default SignUpPage;
