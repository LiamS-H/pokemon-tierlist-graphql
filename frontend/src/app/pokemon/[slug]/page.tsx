import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { PokemonClientPage } from "./client-page";
import clientPagePokemonNode, {
    clientPagePokemonQuery,
} from "./__generated__/clientPagePokemonQuery.graphql";

export async function generateStaticParams() {
    return Array.from({ length: 151 }, (_, i) => ({
        slug: (i + 1).toString(),
    }));
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const num = Number(slug);
    if (Number.isNaN(num)) {
        throw new Error("Invalid Pokemon number");
    }

    const serializedQuery = await loadSerializableQuery<
        typeof clientPagePokemonNode,
        clientPagePokemonQuery
    >(clientPagePokemonNode.params, {
        number: num.toString().padStart(3, "0"),
    });

    return <PokemonClientPage serializedQuery={serializedQuery} />;
}
