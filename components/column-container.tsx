import { Plus, Trash } from "lucide-react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // style
import { useState, useMemo } from "react";

import { Column, Id, Task } from "@/types"

import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";

interface ColumnContainerProps {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
    tasks: Task[];
}

export const ColumnContainer = ({
    column,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
    tasks
}: ColumnContainerProps) => {
    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

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
        },
        disabled: editMode,
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
                // className="bg-neutral-800 h-[500px] w-[350px] max-h-[500px] rounded-md flex flex-col border-2 border-rose-500 opacity-40"
                className="bg-neutral-800 h-[500px] w-[350px] max-h-[500px] rounded-md flex flex-col border-2 border-green-500 opacity-40"
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
                onClick={() => {
                    setEditMode(true);
                }}
                className="bg-neutral-900 h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 border-neutral-800 flex items-center justify-between"
            >
                <div className="flex gap-2">
                    {!editMode && (
                        column.title
                    )}

                    {editMode && (
                        <input
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                            value={column.title}
                            onChange={e => updateColumn(column.id, e.target.value)}
                            className="w-[150px] bg-black focus:border-rose-500 border rounded outline-none px-2"
                        />
                    )}
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
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext
                    items={tasksIds}
                >
                    {/* Tarefas */}
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))}
                </SortableContext>
            </div>

            {/* Column footer */}
            <Button
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add task
            </Button>
        </div>
    )
}