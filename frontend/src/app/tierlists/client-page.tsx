"use client";
import { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import clientPageTierlistNode, {
    clientPageTierlistQuery,
} from "./__generated__/clientPageTierlistQuery.graphql";
import { graphql, usePreloadedQuery, useRelayEnvironment } from "react-relay";
import useSerializableQuery from "@/lib/relay/useSerializeableQuery";
import { TierlistThumbnail } from "@/components/tierlistThumbnail";

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
                    ...tierlistThumbnail_tierlist
                }
            }
        `,
        queryRef
    );
    if (!tierlists || tierlists.length === 0) {
        return <h1>no tierlists</h1>;
    }

    return (
        <div className="w-full flex justify-center">
            <div className="min-w-5xl flex flex-row flex-wrap">
                <ul>
                    {tierlists.map((tierlist) => (
                        <TierlistThumbnail
                            tierlistFrag={tierlist}
                            key={tierlist.id}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
