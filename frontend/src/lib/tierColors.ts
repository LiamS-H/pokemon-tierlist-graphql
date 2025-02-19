import { type HTMLAttributes } from "react";

export function getTierColor(index: number) {
    const tierColors: HTMLAttributes<HTMLDivElement>["className"][] = [
        "bg-rose-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-pink-500",
    ];
    return tierColors[index] || "bg-slate-100";
}
