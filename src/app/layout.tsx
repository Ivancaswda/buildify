import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "next-themes";
import {AuthProvider} from "@/hooks/use-auth";
import Serverrr from "@/app/serverrr";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buildify",
  description: "Создай своё будущее!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <TRPCReactProvider>
    <AuthProvider>
        <html lang="en" suppressHydrationWarning={true}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased `}
          >
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} disableTransitionOnChange={true}>
            {children}
          </ThemeProvider>

          <Toaster/>

          </body>
        </html>
    </AuthProvider>
      </TRPCReactProvider>
  );
}
