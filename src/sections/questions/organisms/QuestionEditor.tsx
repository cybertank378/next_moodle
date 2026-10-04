"use client";

import React, { useState } from "react";
import { useQuestionApi } from "@/modules/questions/presentation/hooks/useQuestionApi";
import { QuestionType, CreateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";

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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Question Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
          <textarea
            required
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
            placeholder="Type your question here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Mark</label>
          <input
            type="number"
            required
            min="1"
            value={formData.defaultMark}
            onChange={(e) => setFormData({ ...formData, defaultMark: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 border rounded-md"
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
