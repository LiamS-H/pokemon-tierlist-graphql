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
            }
            ...tier_tier
        }
        pokemons {
            id
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
    setPokemon: (ids: string[]) => void;
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
        input: useEditableTierlistUpdateMutation$variables["input"]
    ) => {
        if (!tierlist.id) return;
        updateTierlist({
            variables: {
                input,
                id: tierlist.id,
            },
            optimisticResponse: {
                updateTierlist: {
                    ...tierlist,
                    ...input,
                },
            },
        });
    };

    const setTitle = (title: string) => {
        runUpdateMutation({
            title,
        });
    };

    const publishTierlist = () => {
        runUpdateMutation({
            publised: true,
        });
    };

    const deleteTierlist = () => {
        if (!tierlist.id) return;
        deleteTierlistMutation({
            variables: {
                id: tierlist.id,
            },
        });
    };

    const setPokemon = (ids: string[]) => {
        runUpdateMutation({
            pokemonIds: ids,
        });
    };

    const setTier = (id: string, title?: string, pokemonIds?: string[]) => {
        // Find existing tier
        if (!tierlist.tiers) return;
        const tiers = [...tierlist.tiers].map(({ title, id, pokemons }) => ({
            title,
            pokemonIds: pokemons ? pokemons.map(({ id }) => id) : [],
            id,
        }));

        const tierIndex = tiers.findIndex((tier) => tier.id === id);
        if (tierIndex === -1) return;

        const updatedTier = {
            id: id,
            title: title || tiers[tierIndex].title,
            pokemonIds: pokemonIds || tiers[tierIndex].pokemonIds,
        };

        tiers[tierIndex] = updatedTier;

        runUpdateMutation({
            tiers,
        });
    };

    const createTier = () => {
        const newTier = {
            title: "New Tier",
            pokemonIds: [],
        };

        const existingTierInputs = (tierlist.tiers || []).map((tier) => ({
            title: tier.title,
            pokemonIds: tier.pokemons?.map((pokemon) => pokemon.id),
        }));

        runUpdateMutation({
            tiers: [...existingTierInputs, newTier],
        });
    };

    const deleteTier = (id: string) => {
        const updatedTiers = (tierlist.tiers || []).filter(
            (tier) => tier.id !== id
        );

        const tiers = updatedTiers.map((tier) => ({
            title: tier.title,
            pokemonIds: tier.pokemons?.map((pokemon) => pokemon.id),
        }));

        runUpdateMutation({
            tiers,
        });
    };

    return {
        tierlist,
        setTitle,
        publishTierlist,
        deleteTierlist,
        setPokemon,
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
