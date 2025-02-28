"use client";

import { graphql, useQueryLoader } from "react-relay";
import { useParams, notFound } from "next/navigation";
import { Suspense } from "react";
import { pageTierlistQuery } from "./__generated__/pageTierlistQuery.graphql";
import { Tierlist } from "./tierlist";
import Loading from "./loading";

export default function Page() {
    const { slug } = useParams();
    if (!slug) notFound();

    const [queryRefference, loadQuery] = useQueryLoader<pageTierlistQuery>(
        graphql`
            query pageTierlistQuery($id: String!) {
                tierlist(where: { id: $id }) {
                    id
                    published
                    ...tierlistViewOnly
                    ...useEditableTierlist_tierlist
                }
            }
        `
    );

    if (queryRefference === null) {
        loadQuery({ id: slug.toString() });
    }
    if (!queryRefference) {
        return <Loading />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <Tierlist preloadedQuery={queryRefference} />
        </Suspense>
    );
}
