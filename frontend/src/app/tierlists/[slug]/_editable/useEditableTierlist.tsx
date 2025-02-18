import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import {
    useEditableTierlist_tierlist$key,
    useEditableTierlist_tierlist$data,
} from "./__generated__/useEditableTierlist_tierlist.graphql";
import {
    useEditableTierlistUpdateMutation,
    useEditableTierlistUpdateMutation$variables,
} from "./__generated__/useEditableTierlistUpdateMutation.graphql";
import { useEditableTierlistDeleteMutation } from "./__generated__/useEditableTierlistDeleteMutation.graphql";

const tierlistFragment = graphql`
    fragment useEditableTierlist_tierlist on Tierlist {
        id
        title
        published
        tiers {
            id
            title
            pokemons {
                id
                number
                image
                name
            }
            ...tier_tier
        }
        pokemons {
            id
            number
            image
            name
            ...pokemonThumbnail_pokemon
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
    setTier: (id: string, title?: string, pokemonIds?: string[]) => void;
    createTier: () => void;
    deleteTier: (id: string) => void;
} {
    const tierlist = useFragment(tierlistFragment, key);

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
        optimisticResponseSpread: Partial<{
            title: string;
            published: boolean;
            tiers: readonly {
                id: string;
                title: string;
                pokemons:
                    | readonly {
                          id: string;
                          name: string;
                          number: string;
                          image: string;
                      }[]
                    | null
                    | undefined;
            }[];
            pokemons:
                | readonly {
                      id: string;
                      name: string;
                      number: string;
                      image: string;
                  }[]
                | null
                | undefined;
        }>
    ) => {
        const optimisticResponse = {
            updateTierlist: {
                ...tierlist,
                tiers: tierlist.tiers?.map((tier) => ({
                    id: tier.id,
                    title: tier.title,
                    pokemons: tier.pokemons?.map(
                        ({ id, name, number, image }) => ({
                            id,
                            name,
                            number,
                            image,
                        })
                    ),
                })),
                pokemons: (tierlist.pokemons || []).map(
                    ({ id, name, number, image }) => ({
                        id,
                        name,
                        number,
                        image,
                    })
                ),
                ...optimisticResponseSpread,
            },
        };
        console.log(optimisticResponse);
        if (!tierlist.id) return;

        updateTierlist({
            variables: {
                input,
                id: tierlist.id,
            },
            optimisticResponse,
        });
    };

    const setTitle = (title: string) => {
        runUpdateMutation(
            {
                title,
            },
            { title }
        );
    };

    const publishTierlist = () => {
        runUpdateMutation(
            {
                published: true,
            },
            {
                published: true,
            }
        );
    };

    const deleteTierlist = () => {
        if (!tierlist.id) return;
        deleteTierlistMutation({
            variables: {
                id: tierlist.id,
            },
        });
    };

    const addPokemon = (pokemon: {
        id: string;
        name: string;
        image: string;
        number: string;
    }) => {
        const new_pokemons = [...(tierlist.pokemons || []), pokemon];
        const input = {
            pokemonIds: new_pokemons?.map(({ id }) => id),
        };
        runUpdateMutation(input, {
            pokemons: new_pokemons.map(({ id, name, number, image }) => ({
                id,
                name,
                number,
                image,
            })),
        });
    };

    const setTier = (id: string, title?: string, pokemonIds?: string[]) => {
        const oldTiers = tierlist.tiers || [];
        const inputTiers = oldTiers.map(({ title, pokemons }) => ({
            title,
            pokemonIds: pokemons ? pokemons.map(({ id }) => id) : [],
        }));
        const tiers = oldTiers.map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemons,
        }));

        const tierIndex = oldTiers.findIndex((tier) => tier.id === id);
        if (tierIndex === -1) return;

        const updatedTierInput = {
            title: title || inputTiers[tierIndex].title,
            pokemonIds: pokemonIds || inputTiers[tierIndex].pokemonIds,
        };
        inputTiers[tierIndex] = updatedTierInput;
        tiers[tierIndex].pokemons = inputTiers[tierIndex].pokemonIds
            .map((pokemonId) => {
                const pokemon = tierlist.pokemons?.find(
                    ({ id }) => id === pokemonId
                );
                if (!pokemon) return pokemon;
                const { id, image, name, number } = pokemon;
                return { id, image, name, number };
            })
            .filter((p) => p !== undefined);
        tiers[tierIndex].id = id;

        runUpdateMutation(
            { tiers: inputTiers },
            {
                tiers,
            }
        );
    };

    const createTier = () => {
        const updateTiers = (tierlist.tiers || []).map((tier) => ({
            title: tier.title,
            pokemonIds: tier.pokemons?.map((pokemon) => pokemon.id),
        }));
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
            id: "test",
            title: "New Tier",
            pokemons: [],
        });

        runUpdateMutation({ tiers: updateTiers }, { tiers });
    };

    const deleteTier = (deleteId: string) => {
        const oldTiers = (tierlist.tiers || []).filter(
            ({ id }) => id != deleteId
        );
        const updateTiers = oldTiers.map((tier) => ({
            title: tier.title,
            pokemonIds: tier.pokemons?.map((pokemon) => pokemon.id),
        }));
        const tiers = oldTiers.map(({ id, title, pokemons }) => ({
            id,
            title,
            pokemons,
        }));

        runUpdateMutation({ tiers: updateTiers }, { tiers });
    };

    return {
        tierlist,
        setTitle,
        publishTierlist,
        deleteTierlist,
        addPokemon,
        setTier,
        createTier,
        deleteTier,
    };
}

// TODO: look into @updatable directives with linked and assigneable data
// https://relay.dev/docs/guided-tour/updating-data/imperatively-modifying-linked-fields/
// const assignablePokemonFragment = graphql`
//     fragment useEditableTierlist_assignablePokemon on Pokemon @assignable {
//         __typename
//     }
// `;

// const updatablePokemonFragment = graphql`
//     fragment useEditableTierlist_pokemon on Pokemon {
//         name
//         image
//         number
//         id
//     }
// `;

// const updatableTierlistQuery = graphql`
//     query useEditableTierlistQuery($id: String!) @updatable {
//         tierlist(where: { id: $id }) {
//             id
//             title
//             published
//             tiers {
//                 id
//                 title
//                 pokemons {
//                     id
//                     ...useEditableTierlist_assignablePokemon
//                 }
//             }
//             pokemons {
//                 id
//                 ...useEditableTierlist_assignablePokemon
//             }
//             createdAt
//             updatedAt
//         }
//     }
// `;
