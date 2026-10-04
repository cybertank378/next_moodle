"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  type CreateQuestionRequestDto,
  QuestionType,
} from "@/modules/questions/domain/types/QuestionTypes";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import Button from "@/shared-ui/component/Button";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

interface QuestionEditorProps {
  categoryId: number;
  existingQuestion?: any; // The question entity data if editing
  onSuccess?: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  categoryId,
  existingQuestion,
  onSuccess,
}) => {
  const { createQuestion, updateQuestion, loading } = useQuestionApi();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateQuestionRequestDto>({
    categoryId,
    name: existingQuestion?.name || "",
    questionText: existingQuestion?.questionText || "",
    type: existingQuestion?.type || QuestionType.MULTICHOICE,
    defaultMark: existingQuestion?.defaultMark || 1,
    options: existingQuestion?.options || [],
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.questionText,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, questionText: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none w-full px-3 py-2 rounded-b-md min-h-[150px] focus:outline-none bg-white dark:bg-[#151521]",
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let res;
    if (existingQuestion && existingQuestion.id) {
      res = await updateQuestion(existingQuestion.id, {
        name: formData.name,
        questionText: formData.questionText,
        defaultMark: formData.defaultMark,
        options: formData.options,
      });
    } else {
      res = await createQuestion(formData);
    }

    if (res.error) {
      setError((res.error as any).message || "Failed to save question");
    } else if (res.data) {
      if (onSuccess) onSuccess();
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();

  const isEditing = !!existingQuestion;

  return (
    <div className="p-6 bg-white dark:bg-[#151521] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
        {isEditing ? "Edit Question" : "Create New Question"}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <SelectField
            label="Question Type"
            value={formData.type}
            disabled={isEditing}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as QuestionType })
            }
          >
            {Object.values(QuestionType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
        </div>

        <div>
          <TextField
            label="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Question Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Question Text
          </label>
          <div className="border border-gray-300 dark:border-slate-700 rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b border-gray-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
              <Button
                type="button"
                onClick={toggleBold}
                variant={editor?.isActive("bold") ? "filled" : "ghost"}
                size="sm"
                iconOnly
                leftIcon={Bold}
              />
              <Button
                type="button"
                onClick={toggleItalic}
                variant={editor?.isActive("italic") ? "filled" : "ghost"}
                size="sm"
                iconOnly
                leftIcon={Italic}
              />
              <Button
                type="button"
                onClick={toggleStrike}
                variant={editor?.isActive("strike") ? "filled" : "ghost"}
                size="sm"
                iconOnly
                leftIcon={Strikethrough}
              />
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
          </div>
        </div>

        <div>
          <TextField
            label="Default Mark"
            type="number"
            required
            min="1"
            value={formData.defaultMark}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultMark: parseInt(e.target.value, 10),
              })
            }
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="submit" loading={loading} variant="primary">
            {isEditing ? "Update Question" : "Save Question"}
          </Button>
        </div>
      </form>
    </div>
  );
};
