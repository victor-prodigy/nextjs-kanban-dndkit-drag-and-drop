"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
    DndContext,
    DragStartEvent,
    DragOverlay,
    DragEndEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { ColumnContainer } from "@/components/column-container";

import { Column, Id } from "@/types";

function generateId() {
    // Generate a random number between 0 and 10000
    return Math.floor(Math.random() * 10001);
}

export const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    // console.log(columns);

    const onCreateColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    };

    const onDeleteColumn = (id: Id) => {
        const filteredColumn = columns.filter((col) => col.id !== id);
        setColumns(filteredColumn);
    };

    const onDragStart = (event: DragStartEvent) => {
        console.log("DRAG START", event);

        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        console.log("DRAG END");

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    };

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="m-auto flex gap-4"> {/* centraliza */}
                    <div className="flex gap-2">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={onDeleteColumn}
                                />
                            ))}
                        </SortableContext>
                    </div>

                    <Button
                        onClick={onCreateColumn}
                        // className="h-[60px] w-[350px] hover:ring-2 items-center justify-start"
                        className="h-auto w-[250px] hover:ring-2"
                    >
                        <Plus className="mr-4 h-4 w-4" />
                        Add Column
                    </Button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={onDeleteColumn}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}