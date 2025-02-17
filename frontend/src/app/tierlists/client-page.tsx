"use client";
import { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import clientPageTierlistNode, {
    clientPageTierlistQuery,
} from "./__generated__/clientPageTierlistQuery.graphql";
import { graphql, usePreloadedQuery, useRelayEnvironment } from "react-relay";
import useSerializableQuery from "@/lib/relay/useSerializeableQuery";

export function TierlistClientPage({
    serializedQuery,
}: {
    serializedQuery: SerializablePreloadedQuery<
        typeof clientPageTierlistNode,
        clientPageTierlistQuery
    >;
}) {
    const environment = useRelayEnvironment();
    const queryRef = useSerializableQuery<
        typeof clientPageTierlistNode,
        clientPageTierlistQuery
    >(environment, serializedQuery);
    const { tierlists } = usePreloadedQuery(
        graphql`
            query clientPageTierlistQuery {
                tierlists {
                    id
                    title
                    pokemons {
                        ...pokemonThumbnail_pokemon
                    }
                }
            }
        `,
        queryRef
    );
    if (!tierlists || tierlists.length === 0) {
        return <h1>no tierlists</h1>;
    }

    return (
        <div>
            <ul>
                {tierlists.map((tierlist) => (
                    <li key={tierlist.id}>{tierlist.title}</li>
                ))}
            </ul>
        </div>
    );
}
