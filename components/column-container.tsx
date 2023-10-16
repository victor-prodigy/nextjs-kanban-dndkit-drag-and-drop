import { Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // estilo

import { Column, Id } from "@/types"

import { Button } from "@/components/ui/button";

interface ColumnContainerProps {
    column: Column;
    deleteColumn: (id: Id) => void;
}

export const ColumnContainer = ({
    column,
    deleteColumn
}: ColumnContainerProps) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div // é o fundo que aparece quando está arrastando
                ref={setNodeRef}
                style={style}
                className="bg-neutral-800 h-[500px] w-[350px] max-h-[500px] rounded-md flex flex-col border-2 border-rose-500 opacity-40"
            >
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-neutral-800 h-[500px] w-[350px] max-h-[500px] rounded-md flex flex-col border"
        >
            {/* Column title */}
            <div
                {...attributes}
                {...listeners}
                className="bg-neutral-900 h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 border-neutral-800 flex items-center justify-between"
            >
                <div className="flex gap-2">
                    <div className="flex items-center justify-center bg-neutral-800 px-2 py-1 text-sm rounded-full">
                        0
                    </div>
                    {column.title}
                </div>

                <Button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    variant="secondary"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </div>

            {/* Column task container */}
            <div className="flex flex-grow">
                Content
            </div>

            {/* Column footer */}
            <div>
                Footer
            </div>
        </div>
    )
}