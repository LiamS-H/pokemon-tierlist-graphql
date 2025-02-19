import { graphql, useFragment } from "react-relay";
import { Card } from "./ui/card";
import { pokemonThumbnail_pokemon$key } from "./__generated__/pokemonThumbnail_pokemon.graphql";
import { Badge } from "./ui/badge";
import { PokemonImage } from "./pokemonImage";
import Link from "next/link";

export function PokemonThumnail({
    pokemonFragment,
    size = 1,
    link,
}: {
    pokemonFragment: pokemonThumbnail_pokemon$key;
    size?: 0.25 | 0.5 | 1 | 2 | 3 | 4;
    link?: true;
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
    const card = (
        <Card
            className="relative aspect-square w-fit"
            style={{
                width: dimension,
                height: dimension,
            }}
        >
            {size >= 1 && (
                <>
                    <Badge
                        className={`absolute px-1 ${
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
                </>
            )}
            <PokemonImage
                dimension={dimension}
                image={pokemon.image}
                name={pokemon.name}
            />
        </Card>
    );

    if (link) {
        return <Link href={`/pokemon/${pokemon.number}`}>{card}</Link>;
    }

    return card;
}
