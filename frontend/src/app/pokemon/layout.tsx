"use client";
import { useLazyLoadQuery, graphql } from "react-relay";
import { layoutGetAllPokemonImagesAndNamesQuery } from "./__generated__/layoutGetAllPokemonImagesAndNamesQuery.graphql";
import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { type ReactNode } from "react";

const getPokemon = graphql`
    query layoutGetAllPokemonImagesAndNamesQuery {
        allPokemons {
            number
            ...pokemonThumbnail_pokemon
        }
    }
`;

export default function Page({ children }: { children: ReactNode }) {
    const { allPokemons } =
        useLazyLoadQuery<layoutGetAllPokemonImagesAndNamesQuery>(
            getPokemon,
            {},
            { fetchPolicy: "store-or-network" }
        );

    if (!allPokemons) {
        return <div>{children}</div>;
    }

    return (
        <div className="w-full h-full relative">
            <div className="absolute h-full flex justify-center w-full overflow-auto">
                <ul className="flex flex-wrap gap-1 max-w-3xl justify-center">
                    {allPokemons.map((pokemon) => (
                        <li key={pokemon.number}>
                            <PokemonThumnail
                                pokemonFragment={pokemon}
                                size={1}
                                link
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="absoute top-20">{children}</div>
        </div>
    );
}
