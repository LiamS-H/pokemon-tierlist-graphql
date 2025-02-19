import { Droppable } from "@hello-pangea/dnd";
import { PokemonItem } from "./item";
import { useState, type ComponentProps } from "react";

export function PokemonTray({
    pokemons,
    isDragging,
}: {
    pokemons: {
        " $fragmentSpreads": ComponentProps<
            typeof PokemonItem
        >["pokemon"][" $fragmentSpreads"];
        id: string;
    }[];
    isDragging: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex flex-col">
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
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
