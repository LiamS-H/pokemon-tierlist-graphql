import { HTMLAttributes, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { tier_tier$key } from "./__generated__/tier_tier.graphql";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Save, Trash2 } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { PokemonItem } from "./item";

export function Tier({
    tierFragment,
    onEdit,
    onDelete,
    isDragDisabled,
    index,
}: {
    tierFragment: tier_tier$key;
    onEdit: (id: string, title?: string) => void;
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
    const [isEditing, setIsEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(tier.title || "");

    function getBackgroundColor() {
        const tierColors: HTMLAttributes<HTMLDivElement>["className"][] = [
            "bg-green-500",
            "bg-yellow-500",
            "bg-orange-500",
            "bg-red-500",
            "bg-pink-500",
            "bg-purple-500",
        ];
        return tierColors[index] || "bg-slate-100";
    }

    return (
        <div className={`my-4 rounded-lg ${getBackgroundColor()}`}>
            <div className="flex items-center justify-between p-2">
                {isEditing ? (
                    <Input
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        className="w-40"
                    />
                ) : (
                    <h3 className="text-lg font-medium">{tier.title}</h3>
                )}
                <div className="flex gap-2">
                    {isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onEdit(tier.id, titleValue);
                                setIsEditing(false);
                            }}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(tier.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>
            <Droppable droppableId={`tier-${tier.id}`} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-wrap gap-2 min-h-24 p-4 transition-colors ${
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
