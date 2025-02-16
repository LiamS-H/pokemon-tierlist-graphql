import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Button } from "./button";
import { HTMLAttributes } from "react";

const BackButton = ({
    className,
}: {
    className?: HTMLAttributes<HTMLButtonElement>["className"];
}) => {
    const router = useRouter();
    const handleClick = () => {
        router.back();
    };

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            size="icon"
            className={className || undefined}
        >
            <Undo2 />
        </Button>
    );
};

export default BackButton;
