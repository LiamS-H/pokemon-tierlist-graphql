import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { Draggable } from "@hello-pangea/dnd";
import { ComponentProps } from "react";

export function PokemonItem({
    id,
    pokemon,
    index,
    isDragDisabled,
}: {
    id: string;
    pokemon: ComponentProps<typeof PokemonThumnail>["pokemonFragment"];
    index: number;
    isDragDisabled: boolean;
}) {
    return (
        <Draggable
            draggableId={id.toString()}
            index={index}
            isDragDisabled={isDragDisabled}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`m-1 ${snapshot.isDragging ? "shadow-lg" : ""} ${
                        isDragDisabled
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-grab"
                    }`}
                >
                    <PokemonThumnail pokemonFragment={pokemon} />
                </div>
            )}
        </Draggable>
    );
}
