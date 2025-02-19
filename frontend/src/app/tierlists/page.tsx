import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import clientPageTierlistNode, {
    clientPageTierlistQuery,
} from "./__generated__/clientPageTierlistQuery.graphql";
import { TierlistClientPage } from "./client-page";
import { CreateTierlistButton } from "@/components/createTierlistButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Page() {
    const serializedQuery = await loadSerializableQuery<
        typeof clientPageTierlistNode,
        clientPageTierlistQuery
    >(clientPageTierlistNode.params, {});

    return (
        <div className="w-full flex justify-center pt-16">
            <Card className="w-full max-w-4xl">
                <CardHeader className="flex justify-around">
                    <CardTitle className="text-5xl">Tierlists</CardTitle>
                    <CardDescription>
                        <CreateTierlistButton title="unnamed tierlist" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <TierlistClientPage serializedQuery={serializedQuery} />
                </CardContent>
            </Card>
        </div>
    );
}
