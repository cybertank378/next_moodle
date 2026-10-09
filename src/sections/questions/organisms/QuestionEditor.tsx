// Files: src/sections/questions/organisms/QuestionEditor.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  type CreateQuestionRequestDto,
  QuestionType,
} from "@/modules/questions/domain/types/QuestionTypes";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import Button from "@/shared-ui/component/Button";
import { showErrorToast } from "@/shared-ui/component/Toast";
import RichTextEditorField from "@/shared-ui/component/RichTextEditor/RichTextEditorField";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

interface QuestionEditorProps {
  categoryId: number;
  existingQuestion?: Partial<CreateQuestionRequestDto> & { id?: number }; // The question entity data if editing
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

  // Re-synchronize state whenever categoryId or existingQuestion changes
  useEffect(() => {
    setFormData({
      categoryId,
      name: existingQuestion?.name || "",
      questionText: existingQuestion?.questionText || "",
      type: existingQuestion?.type || QuestionType.MULTICHOICE,
      defaultMark: existingQuestion?.defaultMark || 1,
      options: existingQuestion?.options || [],
    });
    setError(null);
  }, [categoryId, existingQuestion]);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let res: { data?: unknown; error?: unknown };
    if (existingQuestion?.id) {
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
      setError(
        (res.error as { message?: string }).message ||
          "Failed to save question",
      );
    } else if (res.data) {
      if (onSuccess) onSuccess();
    }
  };

  const isEditing = !!existingQuestion;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">
        {isEditing ? "Edit Question" : "Create New Question"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <SelectField
            label="Question Type"
            value={formData.type}
            disabled={isEditing}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as QuestionType,
              }))
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Question Name"
          />
        </div>

        <div>
          <RichTextEditorField
            label="Question Text"
            required
            value={formData.questionText}
            onChange={({ html }) =>
              setFormData((prev) => ({ ...prev, questionText: html }))
            }
            placeholder="Tulis teks pertanyaan di sini..."
            minHeight="150px"
          />
        </div>

        <div>
          <TextField
            label="Default Mark"
            type="number"
            required
            min="1"
            value={formData.defaultMark}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                defaultMark: parseInt(e.target.value, 10) || 1,
              }))
            }
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="submit" loading={loading} variant="filled" color="primary">
            {isEditing ? "Update Question" : "Save Question"}
          </Button>
        </div>
      </form>
    </div>
  );
};
