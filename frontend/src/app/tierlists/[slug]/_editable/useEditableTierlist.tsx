// TODO: look into @updatable directives with linked and assigneable data
// https://relay.dev/docs/guided-tour/updating-data/imperatively-modifying-linked-fields/

import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import {
    useEditableTierlist_tierlist$key,
    useEditableTierlist_tierlist$data,
} from "./__generated__/useEditableTierlist_tierlist.graphql";
import {
    TierUpdateInput,
    useEditableTierlistUpdateMutation,
    useEditableTierlistUpdateMutation$variables,
} from "./__generated__/useEditableTierlistUpdateMutation.graphql";
import { useEditableTierlistDeleteMutation } from "./__generated__/useEditableTierlistDeleteMutation.graphql";

type IOptimisticResponseSpread = Partial<{
    title: string;
    published: boolean;
    tiers: readonly {
        id: string;
        title: string;
        pokemons:
            | readonly {
                  readonly pokemon: {
                      id: string;
                      name: string;
                      number: string;
                      image: string;
                  };
              }[]
            | null
            | undefined;
    }[];
    pokemons:
        | readonly {
              readonly pokemon: {
                  id: string;
                  name: string;
                  number: string;
                  image: string;
              };
          }[]
        | null
        | undefined;
}>;

const tierlistFragment = graphql`
    fragment useEditableTierlist_tierlist on Tierlist {
        id
        title
        published
        tiers {
            id
            title
            pokemons {
                pokemon {
                    id
                    number
                    image
                    name
                }
            }
            ...tier_tier
        }
        pokemons {
            pokemon {
                id
                number
                image
                name
                ...pokemonThumbnail_pokemon
            }
        }
        createdAt
        updatedAt
    }
`;

export function useEditableTierlist(key: useEditableTierlist_tierlist$key): {
    tierlist: useEditableTierlist_tierlist$data;
    setTitle: (title: string) => void;
    publishTierlist: () => void;
    deleteTierlist: () => void;
    addPokemon: (pokemon: {
        id: string;
        number: string;
        name: string;
        image: string;
    }) => void;
    setPokemon: (ids: string[]) => void;
    setTiers: (
        tiers: { id: string; title?: string; pokemonIds?: string[] }[],
        pokemon?: string[]
    ) => void;
    createTier: () => void;
    deleteTier: (id: string) => void;
} {
    const tierlist = useFragment(tierlistFragment, key);
    const pokemonsMap = new Map<
        string,
        {
            id: string;
            number: string;
            name: string;
            image: string;
        }
    >();
    tierlist.pokemons?.forEach(({ pokemon: { id, number, name, image } }) => {
        pokemonsMap.set(id, { id, number, name, image });
    });

    const [updateTierlist] = useMutation<useEditableTierlistUpdateMutation>(
        graphql`
            mutation useEditableTierlistUpdateMutation(
                $input: TierlistUpdateInput!
                $id: String!
            ) {
                updateTierlist(data: $input, id: $id) {
                    ...useEditableTierlist_tierlist
                }
            }
        `
    );
    const [deleteTierlistMutation] =
        useMutation<useEditableTierlistDeleteMutation>(
            graphql`
                mutation useEditableTierlistDeleteMutation($id: String!) {
                    deleteTierlist(id: $id) {
                        id
                    }
                }
            `
        );

    const runUpdateMutation = (
        input: useEditableTierlistUpdateMutation$variables["input"],
        optimisticResponseSpread: IOptimisticResponseSpread
    ) => {
        const optimisticResponse = {
            updateTierlist: {
                ...tierlist,
                tiers: tierlist.tiers?.map((tier) => ({
                    id: tier.id,
                    title: tier.title,
                    pokemons: tier.pokemons?.map(
                        ({ pokemon: { id, name, number, image } }) => ({
                            pokemon: {
                                id,
                                name,
                                number,
                                image,
                            },
                        })
                    ),
                })),
                pokemons: (tierlist.pokemons || []).map(
                    ({ pokemon: { id, name, number, image } }) => ({
                        pokemon: {
                            id,
                            name,
                            number,
                            image,
                        },
                    })
                ),
                ...optimisticResponseSpread,
            },
        };
        // console.log(optimisticResponse);
        if (!tierlist.id) return;

        updateTierlist({
            variables: {
                input,
                id: tierlist.id,
            },
            optimisticResponse,
            // optimisticUpdater: (store) => {},
        });
    };

    function setTitle(title: string) {
        runUpdateMutation(
            {
                title,
            },
            { title }
        );
    }

    function publishTierlist() {
        runUpdateMutation(
            {
                published: true,
            },
            {
                published: true,
            }
        );
    }

    function deleteTierlist() {
        if (!tierlist.id) return;
        deleteTierlistMutation({
            variables: {
                id: tierlist.id,
            },
        });
    }

    function addPokemon(pokemon: {
        id: string;
        name: string;
        image: string;
        number: string;
    }) {
        const new_pokemons = [...(tierlist.pokemons || []), { pokemon }];
        const input = {
            pokemonIds: new_pokemons?.map(({ pokemon }) => pokemon.id),
        };
        runUpdateMutation(input, {
            pokemons: new_pokemons.map(
                ({ pokemon: { id, name, number, image } }) => ({
                    pokemon: {
                        id,
                        name,
                        number,
                        image,
                    },
                })
            ),
        });
    }

    function setPokemon(ids: string[]) {
        const input = {
            pokemonIds: ids,
        };
        runUpdateMutation(input, {
            pokemons: ids
                .map((id) => pokemonsMap.get(id))
                .filter((u) => u !== undefined)
                .map((pokemon) => ({
                    pokemon,
                })),
        });
    }

    function setTiers(
        updatedTiers: {
            id: string;
            title?: string;
            pokemonIds?: string[];
        }[],
        pokemonIds?: string[]
    ) {
        const oldTiers = tierlist.tiers || [];
        const inputTiers = oldTiers.map(({ title, id, pokemons }) => ({
            id,
            title,
            pokemonIds: pokemons
                ? pokemons.map(({ pokemon: { id } }) => id)
                : [],
        }));
        const tiers = oldTiers.map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemons,
        }));

        for (const tier of updatedTiers) {
            const id = tier.id;
            const tierIndex = oldTiers.findIndex((tier) => tier.id === id);
            const title = tier.title || inputTiers[tierIndex].title;
            if (tierIndex === -1) continue;
            const pokemonIds =
                tier.pokemonIds || inputTiers[tierIndex].pokemonIds;

            const updatedTierInput = {
                id,
                title,
                pokemonIds,
            };
            inputTiers[tierIndex] = updatedTierInput;

            tiers[tierIndex].pokemons = inputTiers[tierIndex].pokemonIds
                .map((pokemonId) => {
                    const pokemon = pokemonsMap.get(pokemonId);
                    if (!pokemon) return;
                    return { pokemon: pokemon };
                })
                .filter((p) => p !== undefined);
            tiers[tierIndex].id = id;
            tiers[tierIndex].title = title;
        }

        const update: IOptimisticResponseSpread = {
            tiers,
        };

        if (pokemonIds) {
            update.pokemons = pokemonIds
                .map((id) => pokemonsMap.get(id))
                .filter((u) => u !== undefined)
                .map((pokemon) => ({
                    pokemon,
                }));
        }

        runUpdateMutation({ tiers: inputTiers, pokemonIds }, update);
    }

    function createTier() {
        const updateTiers: TierUpdateInput[] = (tierlist.tiers || []).map(
            (tier) => ({
                id: tier.id,
                title: tier.title,
                pokemonIds: tier.pokemons?.map(({ pokemon }) => pokemon.id),
            })
        );
        const tiers = (tierlist.tiers || []).map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemons,
        }));
        updateTiers.push({
            title: "New Tier",
            pokemonIds: [],
        });
        tiers.push({
            id: `<placedholderid-${tiers.length}>`,
            title: "New Tier",
            pokemons: [],
        });

        runUpdateMutation({ tiers: updateTiers }, { tiers });
    }

    function deleteTier(deleteId: string) {
        const oldTiers = (tierlist.tiers || []).filter(
            ({ id }) => id != deleteId
        );
        const tiers = oldTiers.map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemons,
        }));
        const updateTiers = oldTiers.map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemonIds: pokemons?.map(({ pokemon }) => pokemon.id),
        }));

        runUpdateMutation({ tiers: updateTiers }, { tiers });
    }

    return {
        tierlist,
        setTitle,
        publishTierlist,
        deleteTierlist,
        addPokemon,
        setPokemon,
        setTiers,
        createTier,
        deleteTier,
    };
}
