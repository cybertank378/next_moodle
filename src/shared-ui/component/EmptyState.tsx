import { FolderOpen } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: React.ReactNode;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {icon ?? <FolderOpen className="h-6 w-6" />}
      </div>
      <h4 className="text-base font-semibold text-foreground mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
