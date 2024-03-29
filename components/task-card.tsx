import { Trash } from "lucide-react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // style

import { Id, Task } from "@/types"

import { Button } from "@/components/ui/button";

interface TaskCardProps {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

export const TaskCard = ({
    task,
    deleteTask,
    updateTask
}: TaskCardProps) => {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    // Local Onde será arrastado o conteudo
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                // className="bg-neutral-900 p-2.5 px-5 h-[100px] min-h-[100px] items-center justify-between flex text-left rounded-xl border-2 border-rose-500 cursor-grab relative opacity-70"
                className="bg-neutral-900 p-2.5 px-5 h-[100px] min-h-[100px] items-center justify-between flex text-left rounded-xl border-2 border-blue-500 cursor-grab relative opacity-70"
            />
        );
    }

    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-neutral-900 p-2.5 px-5 h-[100px] min-h-[100px] items-center justify-between flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
            >
                {/* Editar Nome da Tarefa */}
                <textarea
                    value={task.content}
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode();
                        }
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                    className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
                >
                </textarea>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            className="bg-neutral-900 p-2.5 px-5 h-[100px] min-h-[100px] items-center justify-between flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task" // task de globals.css
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>

            {/* <p>
                {task.content}
            </p> */}

            {/* Mostra a lixeira quando passar o mouse por cima */}
            {mouseIsOver && (
                <Button
                    onClick={() => {
                        deleteTask(task.id);
                    }}
                    className="hover:bg-rose-500"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}