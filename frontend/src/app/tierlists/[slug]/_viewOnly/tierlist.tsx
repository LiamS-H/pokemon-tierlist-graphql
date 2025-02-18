import { graphql } from "relay-runtime";
import { tierlistViewOnly$key } from "./__generated__/tierlistViewOnly.graphql";
import { useFragment } from "react-relay";

const viewOnlyFragment = graphql`
    fragment tierlistViewOnly on Tierlist {
        id
        title
    }
`;

export function ViewOnly({ fragment }: { fragment: tierlistViewOnly$key }) {
    const tierlist = useFragment(viewOnlyFragment, fragment);

    return <h1>ViewOnly {tierlist.title}</h1>;
}
