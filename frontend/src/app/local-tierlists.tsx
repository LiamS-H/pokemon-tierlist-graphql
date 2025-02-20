"use client";
import { TierlistThumbnail } from "@/components/tierlistThumbnail";
import { storageGetTierlists } from "@/lib/localStorage";
import {
    graphql,
    PreloadedQuery,
    usePreloadedQuery,
    useQueryLoader,
} from "react-relay";
import { localTierlistsQuery } from "./__generated__/localTierlistsQuery.graphql";
import { Suspense, useEffect } from "react";
const query = graphql`
    query localTierlistsQuery($ids: [String!]!) {
        tierlistList(where: { ids: $ids }) {
            id
            ...tierlistThumbnail_tierlist
        }
    }
`;
function Tierlists({
    tierlistsQuery,
}: {
    tierlistsQuery: PreloadedQuery<localTierlistsQuery>;
}) {
    const { tierlistList: tierlists } = usePreloadedQuery(
        query,
        tierlistsQuery
    );

    if (!tierlists) {
        return <h1>something went wrong</h1>;
    }

    return (
        <ul className="flex flex-row flex-wrap gap-2">
            {tierlists.map((tierlist) => (
                <TierlistThumbnail tierlistFrag={tierlist} key={tierlist.id} />
            ))}
        </ul>
    );
}

function Loading() {
    return "loading...";
}

export function LocalTierlists() {
    const [queryRefference, loadQuery] =
        useQueryLoader<localTierlistsQuery>(query);

    useEffect(() => {
        if (!queryRefference) {
            const { unpublished } = storageGetTierlists();
            loadQuery({ ids: unpublished });
        }
    });

    if (!queryRefference) {
        return <Loading />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <Tierlists tierlistsQuery={queryRefference} />
        </Suspense>
    );
}
