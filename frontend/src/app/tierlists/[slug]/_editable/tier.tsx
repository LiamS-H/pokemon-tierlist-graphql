import { HTMLAttributes } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { tier_tier$key } from "./__generated__/tier_tier.graphql";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { PokemonItem } from "./item";
import { EditText } from "@/components/ui/editText";
import { getTierColor } from "@/lib/tierColors";

export function Tier({
    tierFragment,
    onEdit,
    onDelete,
    isDragDisabled,
    index,
}: {
    tierFragment: tier_tier$key;
    onEdit: (title?: string) => void;
    onDelete: (id: string) => void;
    isDragDisabled: boolean;
    index: number;
}) {
    const tier = useFragment(
        graphql`
            fragment tier_tier on Tier {
                id
                title
                pokemons {
                    pokemon {
                        id
                        ...pokemonThumbnail_pokemon
                    }
                }
            }
        `,
        tierFragment
    );

    return (
        <div className={`rounded-lg ${getTierColor(index)}`}>
            <div className="flex items-center justify-between p-2">
                <EditText text={tier.title} setText={onEdit}>
                    <h3 className="">{tier.title}</h3>
                    <Edit2 className="w-3 h-3" />
                </EditText>

                <div className="flex gap-2">
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(tier.id)}
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>
            <Droppable droppableId={`tier-${tier.id}`} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex min-h-24 px-2 pb-2 transition-colors ${
                            snapshot.isDraggingOver ? "bg-slate-200/50" : ""
                        }`}
                    >
                        {tier.pokemons?.map(({ pokemon }, index) => (
                            <PokemonItem
                                key={pokemon.id}
                                id={pokemon.id}
                                pokemon={pokemon}
                                index={index}
                                isDragDisabled={isDragDisabled}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
