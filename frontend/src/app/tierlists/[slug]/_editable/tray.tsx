import { Droppable } from "@hello-pangea/dnd";
import { PokemonItem } from "./item";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

export function PokemonTray({
    pokemons,
    isDragging,
    removePokemon,
}: {
    pokemons: {
        " $fragmentSpreads": ComponentProps<
            typeof PokemonItem
        >["pokemon"][" $fragmentSpreads"];
        id: string;
    }[];
    isDragging: boolean;
    removePokemon: (id: string) => void;
}) {
    const [isRemoving, setIsRemoving] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex">
                {isRemoving ? (
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => setIsRemoving(false)}
                    >
                        Save
                        <Save />
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        onClick={() => setIsRemoving(true)}
                        variant="outline"
                        disabled={pokemons.length === 0}
                    >
                        Remove
                        <Edit />
                    </Button>
                )}
            </div>
            {
                <Droppable droppableId="tray" direction="vertical">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex flex-col min-h-[139.2px] min-w-[139.2px] p-4 border-2 border-dashed rounded-lg ${
                                snapshot.isDraggingOver
                                    ? "bg-secondary/50 border-secondary/90"
                                    : "border-secondary"
                            }`}
                        >
                            {pokemons.map((pokemon, index) => (
                                <PokemonItem
                                    key={pokemon.id}
                                    id={pokemon.id}
                                    pokemon={pokemon}
                                    index={index}
                                    isDragDisabled={isDragging}
                                    remove={
                                        isRemoving
                                            ? () => {
                                                  removePokemon(pokemon.id);
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            }
        </div>
    );
}
