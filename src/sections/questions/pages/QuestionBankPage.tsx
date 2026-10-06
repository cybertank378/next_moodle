// Files: src/sections/questions/pages/QuestionBankPage.tsx
"use client";

import type React from "react";
import { QuestionEditor } from "@/sections/questions/organisms/QuestionEditor";

interface QuestionBankPageProps {
  categoryId: number;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({
  categoryId,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Question Bank</h1>
      </div>

      <QuestionEditor
        categoryId={categoryId}
        onSuccess={() => alert("Question created!")}
      />
    </div>
  );
};
