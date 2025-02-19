import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { type ReactNode, useState } from "react";

export function EditText({
    text,
    setText,
    children,
}: {
    text: string;
    setText: (text: string) => void;
    children: ReactNode;
}) {
    const [textInput, setTextInput] = useState(text);
    const [isEditing, setIsEditing] = useState(false);
    return (
        <Popover
            open={isEditing}
            onOpenChange={(open) => {
                setIsEditing(open);
                if (!open && textInput !== text) {
                    setText(textInput);
                }
                if (open) {
                    setTextInput(text);
                }
            }}
        >
            <PopoverTrigger className="text-lg font-medium flex items-center gap-1">
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setText(textInput);
                        setIsEditing(false);
                    }}
                >
                    <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="w-40"
                    />
                </form>
            </PopoverContent>
        </Popover>
    );
}
