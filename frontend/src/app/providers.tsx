"use client";
import RelayProvider from "@/lib/relay/provider";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return <RelayProvider>{children}</RelayProvider>;
}
