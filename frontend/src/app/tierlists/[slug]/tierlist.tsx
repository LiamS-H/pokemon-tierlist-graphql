import { type PreloadedQuery, usePreloadedQuery } from "react-relay";
import pageTierlistNode, {
    pageTierlistQuery,
} from "./__generated__/pageTierlistQuery.graphql";
import { notFound } from "next/navigation";
import { ViewOnly } from "./_viewOnly/tierlist";
import { Editable } from "./_editable/tierlist";

export function Tierlist({
    preloadedQuery,
}: {
    preloadedQuery: PreloadedQuery<pageTierlistQuery>;
}) {
    const { tierlist } = usePreloadedQuery<pageTierlistQuery>(
        pageTierlistNode,
        preloadedQuery
    );
    if (!tierlist) notFound();
    if (tierlist.published) {
        return <ViewOnly fragment={tierlist} />;
    }
    return <Editable fragment={tierlist} />;
}
