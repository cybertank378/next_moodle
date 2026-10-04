"use client";

import React, { useState } from "react";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import { QuestionType, CreateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import { Bold, Italic, Strikethrough } from "lucide-react";

interface QuestionEditorProps {
  categoryId: number;
  onSuccess?: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ categoryId, onSuccess }) => {
  const { createQuestion, loading } = useQuestionApi();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateQuestionRequestDto>({
    categoryId,
    name: "",
    questionText: "",
    type: QuestionType.MULTICHOICE,
    defaultMark: 1,
    options: [],
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.questionText,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, questionText: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full px-3 py-2 rounded-b-md min-h-[150px] focus:outline-none bg-white dark:bg-[#151521]',
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error: apiError } = await createQuestion(formData);
    
    if (apiError) {
      setError(apiError);
    } else if (data) {
      if (onSuccess) onSuccess();
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();

  return (
    <div className="p-6 bg-white dark:bg-[#151521] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Create New Question</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <SelectField
            label="Question Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
          >
            {Object.values(QuestionType).map(t => (
              <option key={t} value={t}>{t}</option>
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Question Text</label>
          <div className="border border-gray-300 dark:border-slate-700 rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b border-gray-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
              <Button
                type="button"
                onClick={toggleBold}
                variant={editor?.isActive('bold') ? 'filled' : 'ghost'}
                size="sm"
                iconOnly
                leftIcon={Bold}
              />
              <Button
                type="button"
                onClick={toggleItalic}
                variant={editor?.isActive('italic') ? 'filled' : 'ghost'}
                size="sm"
                iconOnly
                leftIcon={Italic}
              />
              <Button
                type="button"
                onClick={toggleStrike}
                variant={editor?.isActive('strike') ? 'filled' : 'ghost'}
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
            onChange={(e) => setFormData({ ...formData, defaultMark: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button
            type="submit"
            loading={loading}
            variant="primary"
          >
            Save Question
          </Button>
        </div>
      </form>
    </div>
  );
};
