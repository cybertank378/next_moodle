import type { ReactNode } from "react";
import Skeleton from "@/shared-ui/component/Skeleton";

interface StatValueProps {
  loading: boolean;
  unavailable: boolean;
  children: ReactNode;
}

/** Renders a metric value, a skeleton while loading, or a dash when unavailable. */
export default function StatValue({
  loading,
  unavailable,
  children,
}: StatValueProps) {
  if (loading) return <Skeleton width={96} height={36} />;
  if (unavailable) {
    return (
      <span className="text-slate-400 " aria-label="Data tidak tersedia">
        —
      </span>
    );
  }
  return <>{children}</>;
}
