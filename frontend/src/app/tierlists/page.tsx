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
            <div className="max-w-5xl">
                <Card className="w-full">
                    <CardHeader className="flex justify-around">
                        <CardTitle className="text-5xl">Tierlists</CardTitle>
                        <CardDescription>
                            <CreateTierlistButton title="unnamed tierlist" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TierlistClientPage serializedQuery={serializedQuery} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
