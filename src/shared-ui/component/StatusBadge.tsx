import { Badge } from "@/components/ui/badge";
import React from "react";

export type BadgeVariantType =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

export interface StatusBadgeProps {
  readonly label: string;
  readonly variant?: BadgeVariantType;
}

export function StatusBadge({ label, variant = "default" }: StatusBadgeProps) {
  return <Badge variant={variant}>{label}</Badge>;
}
