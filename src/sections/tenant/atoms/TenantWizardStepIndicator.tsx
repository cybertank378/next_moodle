"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

import Button from "@/shared-ui/component/Button";

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface TenantWizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export default function TenantWizardStepIndicator({
  steps,
  currentStep,
  onStepClick,
}: TenantWizardStepIndicatorProps) {
  return (
    <nav aria-label="Tenant creation progress" className="w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-2">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = Boolean(onStepClick && step.id < currentStep);

          const stepContent = (
            <>
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                  isCompleted && "bg-emerald-600 text-white",
                  isCurrent && "bg-indigo-600 text-white",
                  !isCurrent && !isCompleted && "bg-slate-100 text-slate-500",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="min-w-0 text-left">
                <p
                  className={clsx(
                    "text-xs font-semibold truncate",
                    isCurrent && "text-indigo-900",
                    isCompleted && "text-emerald-900",
                    !isCurrent && !isCompleted && "text-slate-600",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                  {step.description}
                </p>
              </div>
            </>
          );

          const stepClassName = clsx(
            "flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            isCurrent && "border-indigo-600 bg-indigo-50/50 shadow-sm",
            isCompleted && "border-emerald-200 bg-emerald-50/30",
            !isCurrent &&
              !isCompleted &&
              "border-slate-200 bg-white opacity-70",
            isClickable && "cursor-pointer hover:border-slate-300",
          );

          if (isClickable) {
            return (
              <Button
                key={step.id}
                type="button"
                variant="ghost"
                color="secondary"
                className={clsx(stepClassName, "h-auto p-3")}
                onClick={() => onStepClick?.(step.id)}
              >
                {stepContent}
              </Button>
            );
          }

          return (
            <div key={step.id} className={stepClassName}>
              {stepContent}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
