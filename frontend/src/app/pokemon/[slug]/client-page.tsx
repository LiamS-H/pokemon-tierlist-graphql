"use client";
import { useRelayEnvironment } from "react-relay";
import PokemonDetailNode, {
    detailedPokemonQuery,
} from "./__generated__/detailedPokemonQuery.graphql";
import useSerializableQuery, {
    SerializablePreloadedQuery,
} from "@/lib/relay/useSerializeableQuery";
import DetailedPokemon from "./detailed-pokemon";

export function PokemonDetailed({
    serializedQuery,
}: {
    serializedQuery: SerializablePreloadedQuery<
        typeof PokemonDetailNode,
        detailedPokemonQuery
    >;
}) {
    const environment = useRelayEnvironment();
    const queryRef = useSerializableQuery<
        typeof PokemonDetailNode,
        detailedPokemonQuery
    >(environment, serializedQuery);

    return <DetailedPokemon preloadedQuery={queryRef} />;
}
