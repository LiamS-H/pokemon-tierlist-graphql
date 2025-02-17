import { graphql } from "relay-runtime";

const query = graphql`
    fragment tierlistThumbnail_tierlist on Tierlist {
        id
        title
        pokemons {
            id
            name
            image
        }
        tiers {
            id
            title
            pokemons {
                id
                name
            }
        }
    }
`;
