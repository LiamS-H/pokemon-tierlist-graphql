import { graphql, useFragment } from "react-relay";
import { PokemonImage } from "@/components/pokemonImage";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/backButton";
import { PokemonThumnail } from "@/components/pokemonThumbnail";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { pokemonModal_pokemon$key } from "./__generated__/pokemonModal_pokemon.graphql";

export function PokemonModal({
    fragment,
    buttons,
}: {
    fragment: pokemonModal_pokemon$key;
    buttons: ReactNode;
}) {
    const pokemon = useFragment(
        graphql`
            fragment pokemonModal_pokemon on Pokemon {
                name
                number
                id
                image
                attacks {
                    id
                }
                resistant
                weaknesses
                types
                classification
                evolutionName
                evolutions {
                    id
                    ...pokemonThumbnail_pokemon
                }
                evolvedFrom {
                    id
                    ...pokemonThumbnail_pokemon
                }
            }
        `,
        fragment
    );
    if (!pokemon) {
        return <h1>could not find pokemon</h1>;
    }

    const resistant = pokemon.resistant ?? ["none"];

    const weaknesses = pokemon.weaknesses ?? ["none"];

    return (
        <div className="w-full left-0 flex justify-center">
            <Card className="flex max-w-5xl relative bg-card/90">
                <div className="flex gap-2 absolute top-2 right-2">
                    {buttons}
                </div>
                <PokemonImage
                    dimension={96 * 5}
                    image={pokemon.image}
                    name={pokemon.name}
                />
                <div>
                    <CardHeader className="bg-card/50">
                        <CardTitle>
                            {pokemon.name} - {pokemon.number?.padStart(3, "0")}
                        </CardTitle>
                        <CardDescription>
                            {pokemon.classification}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1">
                        <SectionCard title="Resistances">
                            <div className="flex flex-wrap gap-1">
                                {resistant.map((type) => (
                                    <Badge key={type}>{type}</Badge>
                                ))}
                            </div>
                        </SectionCard>
                        <SectionCard title="Weaknesses">
                            <div className="flex flex-wrap gap-1">
                                {weaknesses.map((type) => (
                                    <Badge key={type}>{type}</Badge>
                                ))}
                            </div>
                        </SectionCard>
                        <div className="flex gap-1">
                            <SectionCard title="Pre-Evolution">
                                {pokemon.evolvedFrom ? (
                                    <PokemonThumnail
                                        pokemonFragment={pokemon.evolvedFrom}
                                        size={2}
                                    />
                                ) : (
                                    <Badge variant="destructive">none</Badge>
                                )}
                            </SectionCard>
                            <SectionCard title="Evolution">
                                {pokemon.evolutions &&
                                pokemon.evolutions.length !== 0 ? (
                                    pokemon.evolutions.map((pokemon) => (
                                        <PokemonThumnail
                                            key={pokemon.id}
                                            pokemonFragment={pokemon}
                                            size={2}
                                        />
                                    ))
                                ) : (
                                    <Badge variant="destructive">none</Badge>
                                )}
                            </SectionCard>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}

function SectionCard({
    title,
    children,
}: {
    title?: string;
    children: ReactNode;
}) {
    return (
        <Card className="p-4 w-full h-fit">
            {title && <CardTitle className="pb-1">{title}</CardTitle>}
            {children}
        </Card>
    );
}
