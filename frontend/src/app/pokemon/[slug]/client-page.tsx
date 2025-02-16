"use client";
import { graphql, usePreloadedQuery, useRelayEnvironment } from "react-relay";
import useSerializableQuery, {
    SerializablePreloadedQuery,
} from "@/lib/relay/useSerializeableQuery";
import { PokemonModal } from "@/components/pokemonModal";
import clientPagePokemonNode, {
    clientPagePokemonQuery,
} from "./__generated__/clientPagePokemonQuery.graphql";

export function PokemonClientPage({
    serializedQuery,
}: {
    serializedQuery: SerializablePreloadedQuery<
        typeof clientPagePokemonNode,
        clientPagePokemonQuery
    >;
}) {
    const environment = useRelayEnvironment();
    const queryRef = useSerializableQuery<
        typeof clientPagePokemonNode,
        clientPagePokemonQuery
    >(environment, serializedQuery);
    const { pokemon } = usePreloadedQuery(
        graphql`
            query clientPagePokemonQuery($number: String) {
                pokemon(where: { number: $number }) {
                    id
                    ...pokemonModal_pokemon
                }
            }
        `,
        queryRef
    );
    if (!pokemon) {
        return <h1>Pokemon not found</h1>;
    }

    return <PokemonModal fragment={pokemon} />;

    // return <PokemonModal preloadedQuery={queryRef} />;
}
