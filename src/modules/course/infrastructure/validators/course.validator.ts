import { ValidationError } from "@/core/errors/ValidationError";

export function parseCourseId(param: string): number {
  const id = Number.parseInt(param, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ValidationError("Parameter courseId harus berupa angka positif.");
  }
  return id;
}

export function parseListCourseQuery(searchParams: URLSearchParams): {
  search?: string;
  categoryId?: number;
} {
  const search = searchParams.get("search")?.trim() || undefined;
  const categoryStr = searchParams.get("categoryId");
  let categoryId: number | undefined;

  if (categoryStr) {
    const parsed = Number.parseInt(categoryStr, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      categoryId = parsed;
    }
  }

  return { search, categoryId };
}
