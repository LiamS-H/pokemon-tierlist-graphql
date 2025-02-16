export function PokemonImage({
    name,
    image,
    dimension,
}: {
    name?: string | null;
    image?: string | null;
    dimension: number;
}) {
    return (
        <img
            style={{
                imageRendering: "pixelated",
                width: dimension,
                height: dimension,
            }}
            src={
                image ||
                "https://static.wikia.nocookie.net/gaming-urban-legends/images/7/7c/MissingNo..webp/revision/latest?cb=20210429173552"
            }
            alt={name || "missingno"}
            width={dimension}
            height={dimension}
        />
    );
}
