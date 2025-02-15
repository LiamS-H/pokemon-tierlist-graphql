import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { detailedPokemonQuery } from "./__generated__/detailedPokemonQuery.graphql";

export default function DetailedPokemon({
    preloadedQuery,
}: {
    preloadedQuery: PreloadedQuery<detailedPokemonQuery>;
}) {
    const { pokemon } = usePreloadedQuery(
        graphql`
            query detailedPokemonQuery($number: String) {
                pokemon(where: { number: $number }) {
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
                        name
                    }
                    evolvedFrom {
                        id
                        name
                    }
                }
            }
        `,
        preloadedQuery
    );
    if (!pokemon) {
        return <h1>could not find pokemon</h1>;
    }
    return <h1>{pokemon.name}</h1>;
}
