import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { NavBar } from "./navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Pokemon Tierlist Maker",
    description: "Gen 1 tierlist maker. unafiliated with pokemon©.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-screen">
            <body className={`antialiased h-full flex flex-col`}>
                <Providers>
                    <Toaster />
                    <NavBar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
