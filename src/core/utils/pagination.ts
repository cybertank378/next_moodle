export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: readonly T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(
  items: readonly T[],
  page = 1,
  limit = 10,
): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const total = items.length;
  const totalPages = Math.ceil(total / safeLimit);
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedItems = items.slice(startIndex, startIndex + safeLimit);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}
