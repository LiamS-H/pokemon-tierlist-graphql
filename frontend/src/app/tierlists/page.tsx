import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import clientPageTierlistNode, {
    clientPageTierlistQuery,
} from "./__generated__/clientPageTierlistQuery.graphql";
import { TierlistClientPage } from "./client-page";
import { CreateTierlistButton } from "@/components/createTierlistButton";

export default async function Page() {
    const serializedQuery = await loadSerializableQuery<
        typeof clientPageTierlistNode,
        clientPageTierlistQuery
    >(clientPageTierlistNode.params, {});

    return (
        <div>
            <CreateTierlistButton title={"unnamed tierlist"} />
            <TierlistClientPage serializedQuery={serializedQuery} />;
        </div>
    );
}
