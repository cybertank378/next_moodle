"use client";

import React, { useState } from "react";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import { QuestionType, CreateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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
        class: 'prose max-w-none w-full px-3 py-2 border rounded-b-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500',
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
    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Create New Question</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(QuestionType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Question Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
          <div className="border rounded-md">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b p-2 bg-slate-50 rounded-t-md">
              <button
                type="button"
                onClick={toggleBold}
                className={`px-2 py-1 text-sm rounded ${editor?.isActive('bold') ? 'bg-slate-300 font-semibold' : 'hover:bg-slate-200 font-semibold'}`}
              >
                B
              </button>
              <button
                type="button"
                onClick={toggleItalic}
                className={`px-2 py-1 text-sm rounded ${editor?.isActive('italic') ? 'bg-slate-300 italic' : 'hover:bg-slate-200 italic'}`}
              >
                I
              </button>
              <button
                type="button"
                onClick={toggleStrike}
                className={`px-2 py-1 text-sm rounded line-through ${editor?.isActive('strike') ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
              >
                S
              </button>
            </div>
            
            {/* Editor Content */}
            <EditorContent editor={editor} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Mark</label>
          <input
            type="number"
            required
            min="1"
            value={formData.defaultMark}
            onChange={(e) => setFormData({ ...formData, defaultMark: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
};
