"use client";
import { type ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getCurrentEnvironment } from "./enviroment";

export default function RelayProvider({ children }: { children: ReactNode }) {
    return (
        <RelayEnvironmentProvider environment={getCurrentEnvironment()}>
            {children}
        </RelayEnvironmentProvider>
    );
}
