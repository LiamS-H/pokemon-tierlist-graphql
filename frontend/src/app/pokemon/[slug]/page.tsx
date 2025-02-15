import { PokemonDetailed } from "./client-page";
import PokemonDetialedNode, {
    type detailedPokemonQuery,
} from "./__generated__/detailedPokemonQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";

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
        typeof PokemonDetialedNode,
        detailedPokemonQuery
    >(PokemonDetialedNode.params, { number: num.toString().padStart(3, "0") });

    return <PokemonDetailed serializedQuery={serializedQuery} />;
}
