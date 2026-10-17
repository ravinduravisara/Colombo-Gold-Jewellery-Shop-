export interface PaginationOptions {
  page?: number;
  limit?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (query: any, defaultLimit = 12, maxLimit = 100): PaginationResult => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  let limit = parseInt(query.limit as string, 10) || defaultLimit;
  
  if (limit > maxLimit) limit = maxLimit;
  if (limit < 1) limit = defaultLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

