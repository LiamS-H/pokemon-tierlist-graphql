"use client";
import { graphql, commitMutation } from "react-relay";
import {
    TierCreateInput,
    TierlistCreateInput,
    createTierlistMutation,
    createTierlistMutation$data,
} from "./__generated__/createTierlistMutation.graphql";
import { Environment } from "relay-runtime";

const mutation = graphql`
    mutation createTierlistMutation($input: TierlistCreateInput!) {
        createTierlist(data: $input) {
            id
            ...tierlistThumbnail_tierlist
        }
    }
`;

export type { TierCreateInput };

export function createTierlist(
    environment: Environment,
    input: TierlistCreateInput
): Promise<createTierlistMutation$data> {
    return new Promise((resolve, reject) => {
        commitMutation<createTierlistMutation>(environment, {
            mutation,
            variables: { input },
            onCompleted: (response, errors) => {
                if (errors) {
                    reject(errors);
                } else {
                    resolve(response);
                }
            },
            onError: (error) => {
                reject(error);
            },
        });
    });
}
