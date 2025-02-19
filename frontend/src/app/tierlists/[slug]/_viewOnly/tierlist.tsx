import { graphql } from "relay-runtime";
import { tierlistViewOnly$key } from "./__generated__/tierlistViewOnly.graphql";
import { useFragment } from "react-relay";
import { CopyPlus, FileCheck } from "lucide-react";
import { TimeAgo } from "@/components/ui/timeAgo";
import { Badge } from "@/components/ui/badge";
import { PokemonThumnail } from "@/components/pokemonThumbnail";
import { getTierColor } from "@/lib/tierColors";
import { CreateTierlistButton } from "@/components/createTierlistButton";

const viewOnlyFragment = graphql`
    fragment tierlistViewOnly on Tierlist {
        id
        title
        published
        tiers {
            id
            title
            pokemons {
                pokemon {
                    id
                    ...pokemonThumbnail_pokemon
                }
            }
        }
        pokemons {
            pokemon {
                id
                ...pokemonThumbnail_pokemon
            }
        }
        createdAt
        updatedAt
    }
`;

export function ViewOnly({ fragment }: { fragment: tierlistViewOnly$key }) {
    const tierlist = useFragment(viewOnlyFragment, fragment);
    function getUnusedPokemons() {
        if (!tierlist.pokemons) return [];

        const usedIds = new Set();
        tierlist.tiers?.forEach((tier) => {
            tier.pokemons?.forEach(({ pokemon }) => {
                usedIds.add(pokemon.id);
            });
        });

        return tierlist.pokemons.filter(
            ({ pokemon }) => !usedIds.has(pokemon.id)
        );
    }
    const unusedPokemons = getUnusedPokemons();

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-5xl">{tierlist.title}</h1>
                    <Badge
                        variant="outline"
                        className="text-sm h-fit w-fit flex align-text-bottom"
                    >
                        <FileCheck className="w-3 h-3 mr-1" />
                        <TimeAgo timestamp={tierlist.updatedAt} />
                    </Badge>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                    <CreateTierlistButton
                        title={`${tierlist.title} (copy)`}
                        pokemonIds={tierlist.pokemons?.map(
                            ({ pokemon: { id } }) => id
                        )}
                        tiers={tierlist.tiers?.map((tier) => ({
                            title: tier.title,
                            pokemonIds: tier.pokemons?.map(
                                ({ pokemon: { id } }) => id
                            ),
                        }))}
                    >
                        Clone Tierlist
                        <CopyPlus />
                    </CreateTierlistButton>
                </div>
            </div>

            <div className="flex gap-2">
                {/* Tiers */}
                <div className="flex flex-grow flex-col space-y-4">
                    {tierlist.tiers?.map((tier, index) => (
                        <div
                            className={`rounded-lg ${getTierColor(index)}`}
                            key={tier.id}
                        >
                            <div className="flex items-center justify-between p-2">
                                <h3 className="">{tier.title}</h3>
                            </div>
                            <div className="flex min-h-24 px-2 pb-2 transition-color">
                                {tier.pokemons?.map(({ pokemon }) => (
                                    <PokemonThumnail
                                        key={pokemon.id}
                                        pokemonFragment={pokemon}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pokemon Tray */}
                <div className="flex flex-col">
                    <div className="flex flex-col min-h-[139.2px] min-w-[139.2px] p-4 border-2 border-dashed rounded-lg">
                        {unusedPokemons.map(({ pokemon }, index) => (
                            <PokemonThumnail
                                key={pokemon.id}
                                pokemonFragment={pokemon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
