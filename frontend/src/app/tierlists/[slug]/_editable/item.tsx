import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { Draggable } from "@hello-pangea/dnd";
import { ComponentProps } from "react";

export function PokemonItem({
    id,
    pokemon,
    index,
    isDragDisabled,
    remove,
}: {
    id: string;
    pokemon: ComponentProps<typeof PokemonThumnail>["pokemonFragment"];
    index: number;
    isDragDisabled: boolean;
    remove?: () => void;
}) {
    const removeable = remove !== undefined;

    return (
        <Draggable
            draggableId={id.toString()}
            index={index}
            isDragDisabled={isDragDisabled || removeable}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`m-1 ${snapshot.isDragging ? "shadow-lg" : ""} ${
                        isDragDisabled ? "cursor-not-allowed" : "cursor-grab"
                    } ${
                        removeable
                            ? "cursor-pointer hover:rotate-3 transition-transform"
                            : ""
                    }`}
                    onClick={remove}
                >
                    <PokemonThumnail pokemonFragment={pokemon} />
                </div>
            )}
        </Draggable>
    );
}
