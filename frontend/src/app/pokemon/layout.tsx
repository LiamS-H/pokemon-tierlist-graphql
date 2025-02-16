"use client";
import { useLazyLoadQuery, graphql } from "react-relay";
import { layoutGetAllPokemonImagesAndNamesQuery } from "./__generated__/layoutGetAllPokemonImagesAndNamesQuery.graphql";
import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { type ReactNode } from "react";

const getPokemon = graphql`
    query layoutGetAllPokemonImagesAndNamesQuery {
        allPokemons {
            id
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
        <div className="w-full flex justify-center">
            <div className="max-w-4xl">
                <ul className="flex flex-wrap gap-1">
                    {allPokemons.map((pokemon) => (
                        <li key={pokemon.id}>
                            <PokemonThumnail
                                pokemonFragment={pokemon}
                                size={1}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            {children}
        </div>
    );
}
