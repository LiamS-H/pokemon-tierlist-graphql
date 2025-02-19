"use client";
import { createTierlist, TierCreateInput } from "@/mutations/createTierlist";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRelayEnvironment } from "react-relay";
import { storageCreateTierlist } from "@/lib/localStorage";
import type { ReactNode } from "react";

export function CreateTierlistButton({
    title,
    pokemonIds = [],
    tiers = [],
    children,
}: {
    title: string;
    pokemonIds?: string[];
    tiers?: TierCreateInput[];
    children?: ReactNode;
}) {
    const { push } = useRouter();
    const environment = useRelayEnvironment();
    async function handleCreate() {
        try {
            toast("Creating new tierlist...");
            const { createTierlist: data } = await createTierlist(environment, {
                title,
                pokemonIds,
                tiers,
            });
            if (!data || !data.id) {
                throw Error(`createTierlist returned:${data}`);
            }
            push(`/tierlists/${data.id}`);
            toast("Tierlist created!");
            storageCreateTierlist(data.id);
        } catch (e) {
            console.error(e);
            toast("Something went wrong.");
        }
    }

    return (
        <Button onClick={handleCreate}>
            {children ? (
                children
            ) : (
                <>
                    <Plus />
                    Tierlist
                </>
            )}
        </Button>
    );
}
