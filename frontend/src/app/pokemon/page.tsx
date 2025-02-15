"use client";
import { useLazyLoadQuery, graphql } from "react-relay";
import { pageGetAllPokemonImagesAndNamesQuery } from "./__generated__/pageGetAllPokemonImagesAndNamesQuery.graphql";

const GET_ALL_POKEMON_IMAGES_AND_NAMES = graphql`
    query pageGetAllPokemonImagesAndNamesQuery {
        allPokemons {
            id
            name
            image
        }
    }
`;

function PokemonImageNameList() {
    const { allPokemons } =
        useLazyLoadQuery<pageGetAllPokemonImagesAndNamesQuery>(
            GET_ALL_POKEMON_IMAGES_AND_NAMES,
            {},
            { fetchPolicy: "store-or-network" }
        );

    if (!allPokemons) {
        return <div>Loading...</div>;
    }

    return (
        <ul>
            {allPokemons.map((pokemon) => (
                <li key={pokemon.id}>
                    {pokemon.image && (
                        <img
                            src={pokemon.image}
                            alt={pokemon.name || "undefined"}
                        />
                    )}
                    <span>{pokemon.name}</span>
                </li>
            ))}
        </ul>
    );
}

export default PokemonImageNameList;
