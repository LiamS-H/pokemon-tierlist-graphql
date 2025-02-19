import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, FileCheck, PlusCircle } from "lucide-react";
import { useEditableTierlist_tierlist$key } from "./__generated__/useEditableTierlist_tierlist.graphql";
import { useEditableTierlist } from "./useEditableTierlist";
import { Tier } from "./tier";
import { PokemonPool } from "./pokemonPool";
import { TimeAgo } from "@/components/ui/timeAgo";
import { EditText } from "@/components/ui/editText";
import { PokemonTray } from "./tray";
import { useRouter } from "next/navigation";

export function Editable({
    fragment,
}: {
    fragment: useEditableTierlist_tierlist$key;
}) {
    const {
        tierlist,
        setTitle,
        publishTierlist,
        addPokemon,
        setPokemon,
        deleteTierlist,
        createTier,
        setTiers,
        deleteTier,
    } = useEditableTierlist(fragment);

    const [isDragging, setIsDragging] = useState(false);
    const { push: pushRoute } = useRouter();

    const onDragStart = () => {
        setIsDragging(true);
    };
    function getUnusedPokemons() {
        if (!tierlist.pokemons) return [];

        const usedIds = new Set();
        tierlist.tiers?.forEach((tier) => {
            tier.pokemons?.forEach(({ pokemon }) => {
                usedIds.add(pokemon.id);
            });
        });

        return tierlist.pokemons.filter(
            ({ pokemon }) => !usedIds.has(pokemon.id)
        );
    }
    const unusedPokemons = getUnusedPokemons();

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);

        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const sourceId =
            source.droppableId === "tray"
                ? "tray"
                : source.droppableId.replace("tier-", "");

        const destinationId =
            destination.droppableId === "tray"
                ? "tray"
                : destination.droppableId.replace("tier-", "");

        const pokemonId = draggableId;

        if (sourceId === destinationId && sourceId === "tray") {
            const pokemonIds = unusedPokemons.map(({ pokemon }) => pokemon.id);
            if (!pokemonIds) return;
            pokemonIds?.splice(source.index, 1);
            pokemonIds?.splice(destination.index, 0, pokemonId);

            tierlist.pokemons?.forEach(({ pokemon: { id } }) => {
                if (!pokemonIds.includes(id)) {
                    pokemonIds.push(id);
                }
            });

            setPokemon(pokemonIds);
            return;
        }
        if (sourceId === destinationId && sourceId !== "tray") {
            const tier = (tierlist.tiers ?? []).find((t) => t.id === sourceId);
            if (!tier || !tier.pokemons) return;

            const pokemonIds = tier.pokemons.map(({ pokemon }) => pokemon.id);
            pokemonIds.splice(source.index, 1);
            pokemonIds.splice(destination.index, 0, pokemonId);

            setTiers([{ id: sourceId, pokemonIds }]);
            return;
        }
        if (sourceId === "tray" && destinationId !== "tray") {
            const tier = (tierlist.tiers ?? []).find(
                (t) => t.id === destinationId
            );
            if (!tier) return;

            const currentIds = tier.pokemons
                ? tier.pokemons.map(({ pokemon }) => pokemon.id)
                : [];

            const newIds = [...currentIds];
            newIds.splice(destination.index, 0, pokemonId);

            setTiers([{ id: destinationId, pokemonIds: newIds }]);
            return;
        }
        if (sourceId !== "tray" && destinationId === "tray") {
            const sourceTier = (tierlist.tiers ?? []).find(
                (t) => t.id === sourceId
            );
            if (!sourceTier || !sourceTier.pokemons) return;

            const newSourceIds = sourceTier.pokemons
                .map(({ pokemon }) => pokemon.id)
                .filter((id) => id !== pokemonId);

            const pokemonIds = unusedPokemons.map(({ pokemon }) => pokemon.id);
            pokemonIds.splice(destination.index, 0, pokemonId);

            tierlist.pokemons?.forEach(({ pokemon: { id } }) => {
                if (!pokemonIds.includes(id)) pokemonIds.push(id);
            });

            setTiers([{ id: sourceId, pokemonIds: newSourceIds }], pokemonIds);
            return;
        }
        if (sourceId !== "tray" && destinationId !== "tray") {
            const sourceTier = (tierlist.tiers ?? []).find(
                (t) => t.id === sourceId
            );
            if (!sourceTier || !sourceTier.pokemons) return;

            const newSourceIds = sourceTier.pokemons
                .map(({ pokemon }) => pokemon.id)
                .filter((id) => id !== pokemonId);

            const destTier = (tierlist.tiers ?? []).find(
                (t) => t.id === destinationId
            );
            if (!destTier) return;

            const currentDestIds = destTier.pokemons
                ? destTier.pokemons.map(({ pokemon }) => pokemon.id)
                : [];
            const newDestIds = [...currentDestIds];
            newDestIds.splice(destination.index, 0, pokemonId);

            setTiers([
                { id: sourceId, pokemonIds: newSourceIds },
                { id: destinationId, pokemonIds: newDestIds },
            ]);
            return;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <EditText text={tierlist.title} setText={setTitle}>
                        <h1 className="text-5xl">{tierlist.title}</h1>
                        <Edit2 />
                    </EditText>
                    <Badge
                        variant="outline"
                        className="text-sm h-fit w-fit flex align-text-bottom"
                    >
                        <FileCheck className="w-3 h-3 mr-1" />
                        <TimeAgo timestamp={tierlist.updatedAt} />
                    </Badge>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                    <Button
                        onClick={() => {
                            publishTierlist();
                        }}
                        size="sm"
                    >
                        Publish
                    </Button>
                    <Button
                        onClick={() => {
                            deleteTierlist();
                            pushRoute("/");
                        }}
                        variant="destructive"
                        size="sm"
                    >
                        Delete Tierlist
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <div className="flex gap-2">
                    {/* Tiers */}
                    <div className="flex flex-grow flex-col space-y-4">
                        {tierlist.tiers?.map((tier, index) => (
                            <Tier
                                key={tier.id}
                                index={index}
                                tierFragment={tier}
                                onEdit={(title) => {
                                    setTiers([{ id: tier.id, title }]);
                                }}
                                onDelete={deleteTier}
                                isDragDisabled={isDragging}
                            />
                        ))}

                        <Button
                            onClick={createTier}
                            variant="outline"
                            className="mt-4 w-full"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add New Tier
                        </Button>
                        <div>
                            <PokemonPool
                                addPokemon={addPokemon}
                                usedPokemon={
                                    tierlist.pokemons?.map(
                                        ({ pokemon }) => pokemon.id
                                    ) || []
                                }
                            />
                        </div>
                    </div>

                    {/* Pokemon Tray */}
                    <PokemonTray
                        pokemons={unusedPokemons.map(({ pokemon }) => pokemon)}
                        isDragging={isDragging}
                    />
                </div>
            </DragDropContext>
        </div>
    );
}
