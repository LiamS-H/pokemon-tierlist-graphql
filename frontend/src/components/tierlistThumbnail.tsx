import { graphql } from "relay-runtime";
import { tierlistThumbnail_tierlist$key } from "./__generated__/tierlistThumbnail_tierlist.graphql";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { useFragment } from "react-relay";
import { PokemonThumnail } from "./pokemonThumbnail";
import { getTierColor } from "@/lib/tierColors";
import { Button } from "./ui/button";
import Link from "next/link";

const query = graphql`
    fragment tierlistThumbnail_tierlist on Tierlist {
        id
        title
        pokemons {
            pokemon {
                id
                ...pokemonThumbnail_pokemon
            }
        }
        tiers {
            id
            pokemons {
                pokemon {
                    id
                    ...pokemonThumbnail_pokemon
                }
            }
        }
    }
`;

export function TierlistThumbnail({
    tierlistFrag,
}: {
    tierlistFrag: tierlistThumbnail_tierlist$key;
}) {
    const tierlist = useFragment(query, tierlistFrag);
    return (
        <Card className="relative aspect-square max-w-48 w-48 p-2">
            <CardHeader className="p-2">
                <CardTitle>{tierlist.title}</CardTitle>
            </CardHeader>
            <div className="px-0 rounded-md overflow-clip blur-[2px]">
                {tierlist.tiers?.map((tier, index) => {
                    return (
                        <div
                            key={tier.id}
                            className={`w-full flex overflow-clip ${getTierColor(
                                index
                            )}`}
                        >
                            {tier.pokemons?.map(({ pokemon }) => (
                                <div className="p-[1px]" key={pokemon.id}>
                                    <PokemonThumnail
                                        size={0.25}
                                        pokemonFragment={pokemon}
                                    />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-2 w-full flex justify-center">
                <Link href={`/tierlists/${tierlist.id}`}>
                    <Button variant="secondary">View Tierlist</Button>
                </Link>
            </div>
        </Card>
    );
}
