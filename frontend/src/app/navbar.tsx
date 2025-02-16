"use client";
import { Button } from "@/components/ui/button";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function NavbarItem({ href, children }: { href: Url; children: ReactNode }) {
    const path = usePathname();
    const active =
        href === "/" ? path === "/" : path.startsWith(href.toString());
    return (
        <li>
            <Link href={href}>
                <Button
                    variant={active ? "default" : "ghost"}
                    className={
                        active
                            ? "underline underline-offset-2"
                            : "text-primary-foreground"
                    }
                >
                    {children}
                </Button>
            </Link>
        </li>
    );
}

export function NavBar() {
    return (
        <div className="sticky top-0 p-2 bg-primary z-10">
            <ul className="flex gap-4">
                <NavbarItem href={"/"}>Create</NavbarItem>
                <NavbarItem href={"/tierlists"}>Tierlists</NavbarItem>
                <NavbarItem href={"/pokemon"}>Pokemon</NavbarItem>
            </ul>
        </div>
    );
}
