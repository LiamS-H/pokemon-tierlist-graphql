import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { pokemonPoolQuery } from "./__generated__/pokemonPoolQuery.graphql";

export function PokemonPool({
    addPokemon,
    usedPokemon,
}: {
    addPokemon: (pokemon: {
        id: string;
        number: string;
        name: string;
        image: string;
    }) => void;
    usedPokemon: string[];
}) {
    const { allPokemons } = useLazyLoadQuery<pokemonPoolQuery>(
        graphql`
            query pokemonPoolQuery {
                allPokemons {
                    id
                    number
                    name
                    image
                    ...pokemonThumbnail_pokemon
                }
            }
        `,
        {},
        { fetchPolicy: "store-or-network" }
    );

    if (!allPokemons) {
        return <div>noPokemon</div>;
    }

    return (
        <div className="h-full flex justify-center w-full">
            <ul className="flex flex-wrap gap-1 max-w-3xl justify-center">
                {allPokemons.map((pokemon) => {
                    const { id, number, name, image } = pokemon;
                    return (
                        <li
                            key={id}
                            className="hover:-rotate-2 transition-transform"
                        >
                            <button
                                className="disabled:opacity-50"
                                disabled={usedPokemon.includes(id)}
                                onClick={() =>
                                    addPokemon({ id, number, name, image })
                                }
                            >
                                <PokemonThumnail
                                    pokemonFragment={pokemon}
                                    size={1}
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
