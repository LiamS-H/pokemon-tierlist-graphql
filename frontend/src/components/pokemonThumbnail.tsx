import { graphql, useFragment } from "react-relay";
import { Card } from "./ui/card";
import { pokemonThumbnail_pokemon$key } from "./__generated__/pokemonThumbnail_pokemon.graphql";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { PokemonImage } from "./pokemonImage";

export function PokemonThumnail({
    pokemonFragment,
    size = 1,
}: {
    pokemonFragment: pokemonThumbnail_pokemon$key;
    size?: 1 | 2 | 3 | 4;
}) {
    const pokemon = useFragment(
        graphql`
            fragment pokemonThumbnail_pokemon on Pokemon {
                name
                image
                number
                id
            }
        `,
        pokemonFragment
    );

    const dimension = 96 * size;

    return (
        <Link href={`/pokemon/${pokemon.number}`}>
            <Card
                className="relative aspect-square w-fit"
                style={{
                    width: dimension,
                    height: dimension,
                }}
            >
                <Badge
                    className={`absolute ${
                        size === 1 ? "top-1 left-1" : "top-2 left-2"
                    }`}
                >
                    {pokemon.name}
                </Badge>
                <Badge
                    className={`absolute ${
                        size === 1 ? "bottom-1 right-1" : "bottom-2 right-2"
                    }`}
                    variant="secondary"
                >
                    {pokemon.number}
                </Badge>
                <PokemonImage
                    dimension={dimension}
                    image={pokemon.image}
                    name={pokemon.name}
                />
            </Card>
        </Link>
    );
}
