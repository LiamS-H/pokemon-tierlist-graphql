import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEditableTierlist_tierlist$key } from "./__generated__/useEditableTierlist_tierlist.graphql";
import { useEditableTierlist } from "./useEditableTierlist";
import { Tier } from "./tier";
import { PokemonItem } from "./item";
import { PokemonPool } from "./pokemonPool";

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
        deleteTierlist,
        createTier,
        setTier,
        deleteTier,
    } = useEditableTierlist(fragment);

    const [isDragging, setIsDragging] = useState(false);

    const onDragStart = () => {
        setIsDragging(true);
    };

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

        if (sourceId === destinationId && sourceId !== "tray") {
            const tier = (tierlist.tiers ?? []).find((t) => t.id === sourceId);
            if (!tier || !tier.pokemons) return;

            const pokemonIds = [...tier.pokemons.map((p) => p.id)];
            pokemonIds.splice(source.index, 1);
            pokemonIds.splice(destination.index, 0, pokemonId);

            setTier(sourceId, undefined, pokemonIds);
        } else if (sourceId === "tray" && destinationId !== "tray") {
            const tier = (tierlist.tiers ?? []).find(
                (t) => t.id === destinationId
            );
            if (!tier) return;

            const currentIds = tier.pokemons
                ? tier.pokemons.map((p) => p.id)
                : [];

            const newIds = [...currentIds];
            newIds.splice(destination.index, 0, pokemonId);

            setTier(destinationId, undefined, newIds);

            // const unusedPokemons = getUnusedPokemons();
            // if (unusedPokemons.some((p) => p.id === pokemonId)) {
            //     const newPokemonList = unusedPokemons
            //         .filter((p) => p.id !== pokemonId)
            //         .map((p) => p.id);
            //     setPokemon(newPokemonList);
            // }
        } else if (sourceId !== "tray" && destinationId === "tray") {
            const sourceTier = (tierlist.tiers ?? []).find(
                (t) => t.id === sourceId
            );
            if (!sourceTier || !sourceTier.pokemons) return;

            const newSourceIds = sourceTier.pokemons
                .map((p) => p.id)
                .filter((id) => id !== pokemonId);

            setTier(sourceId, undefined, newSourceIds);

            // const unusedPokemons = getUnusedPokemons();
            // if (!unusedPokemons.some((p) => p.id === pokemonId)) {
            //     const newPokemonList = [
            //         ...unusedPokemons.map((p) => p.id),
            //         pokemonId,
            //     ];
            //     setPokemon(newPokemonList);
            // }
        } else if (sourceId !== "tray" && destinationId !== "tray") {
            const sourceTier = (tierlist.tiers ?? []).find(
                (t) => t.id === sourceId
            );
            if (!sourceTier || !sourceTier.pokemons) return;

            const newSourceIds = sourceTier.pokemons
                .map((p) => p.id)
                .filter((id) => id !== pokemonId);

            setTier(sourceId, undefined, newSourceIds);

            const destTier = (tierlist.tiers ?? []).find(
                (t) => t.id === destinationId
            );
            if (!destTier) return;

            const currentDestIds = destTier.pokemons
                ? destTier.pokemons.map((p) => p.id)
                : [];
            const newDestIds = [...currentDestIds];
            newDestIds.splice(destination.index, 0, pokemonId);

            setTier(destinationId, undefined, newDestIds);
        }
    };

    const getUnusedPokemons = () => {
        if (!tierlist.pokemons) return [];

        const usedIds = new Set();
        tierlist.tiers?.forEach((tier) => {
            tier.pokemons?.forEach((pokemon) => {
                usedIds.add(pokemon.id);
            });
        });

        return tierlist.pokemons.filter((pokemon) => !usedIds.has(pokemon.id));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <input
                    type="text"
                    value={tierlist.title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
                    placeholder="Tierlist Title"
                />
                <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="outline" className="text-sm">
                        Last updated:{" "}
                        {new Date(tierlist.updatedAt).toLocaleDateString()}
                    </Badge>
                    <Button onClick={publishTierlist} size="sm">
                        Publish
                    </Button>
                    <Button
                        onClick={deleteTierlist}
                        variant="destructive"
                        size="sm"
                    >
                        Delete Tierlist
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                {/* Tiers */}
                <div className="space-y-4">
                    {tierlist.tiers?.map((tier, index) => (
                        <Tier
                            key={tier.id}
                            index={index}
                            tierFragment={tier}
                            onEdit={(id, title) => setTier(id, title)}
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
                </div>

                {/* Pokemon Tray */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Available Pokemon
                    </h2>
                    <Droppable droppableId="tray" direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex flex-wrap gap-2 min-h-24 p-4 border-2 border-dashed rounded-lg ${
                                    snapshot.isDraggingOver
                                        ? "bg-slate-100 border-slate-300"
                                        : "border-slate-200"
                                }`}
                            >
                                {getUnusedPokemons().map((pokemon, index) => (
                                    <PokemonItem
                                        key={pokemon.id}
                                        id={pokemon.id}
                                        pokemon={pokemon}
                                        index={index}
                                        isDragDisabled={isDragging}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
            <div>
                <PokemonPool
                    addPokemon={addPokemon}
                    usedPokemon={tierlist.pokemons?.map(({ id }) => id) || []}
                />
            </div>
        </div>
    );
}
