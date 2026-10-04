"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { useExamAdminApi } from "@/modules/exam-administration/presentation/hooks/useExamAdminApi";
import Button from "@/shared-ui/component/Button";

interface QuestionItem {
  id: string;
  questionId: number;
  text: string;
  slot: number;
}

function SortableItem(props: { id: string; item: QuestionItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-500 transition-colors flex items-center gap-4"
    >
      <div className="text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
      <div className="flex-1 font-medium text-gray-800">
        <span className="mr-3 inline-flex items-center justify-center w-6 h-6 text-sm bg-blue-100 text-blue-700 rounded-full font-bold">
          {props.item.slot}
        </span>
        {props.item.text}
      </div>
    </div>
  );
}

export function QuizCompositionEditor({
  quizId,
  initialQuestions,
}: {
  quizId: number;
  initialQuestions: QuestionItem[];
}) {
  const [items, setItems] = useState(initialQuestions);
  const { reorderQuestions, loading, error } = useExamAdminApi();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          slot: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    const payload = items.map((i) => ({
      questionId: i.questionId,
      slot: i.slot,
    }));
    await reorderQuestions(quizId, payload);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Composition</h2>
        <Button onClick={handleSave} disabled={loading} variant="primary">
          {loading ? "Saving..." : "Save Order"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
