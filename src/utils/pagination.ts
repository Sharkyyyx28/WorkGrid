export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PrismaPaginationParams {
  skip?: number;
  take: number;
  cursor?: { id: string };
  orderBy: any[];
}

export class PaginationUtil {
  public static getPrismaParams(
    options: PaginationOptions,
    defaultSortBy = 'createdAt'
  ): PrismaPaginationParams {
    const page = options.page && options.page > 0 ? Number(options.page) : 1;
    const limit = options.limit && options.limit > 0 ? Number(options.limit) : 10;
    const cursor = options.cursor;
    const sortBy = options.sortBy || defaultSortBy;
    const sortOrder = options.sortOrder || 'desc';

    // To guarantee a stable sort order for cursor pagination, always include a unique column (id) in orderBy
    const orderBy = [{ [sortBy]: sortOrder }, { id: sortOrder }];

    if (cursor) {
      return {
        take: limit + 1, // Fetch limit + 1 to determine if hasNextPage
        skip: 1, // Skip the cursor itself
        cursor: { id: cursor },
        orderBy,
      };
    }

    return {
      take: limit + 1, // Fetch limit + 1 to determine if hasNextPage for offset pagination
      skip: (page - 1) * limit,
      orderBy,
    };
  }

  public static formatResponse<T extends { id?: string }>(
    items: T[],
    total: number,
    options: PaginationOptions
  ) {
    const page = options.page && options.page > 0 ? Number(options.page) : 1;
    const limit = options.limit && options.limit > 0 ? Number(options.limit) : 10;
    const hasNextPage = items.length > limit;

    if (hasNextPage) {
      items.pop(); // Remove the extra item fetched for hasNextPage check
    }

    const nextCursor = hasNextPage && items.length > 0 ? items[items.length - 1].id : null;

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage,
        nextCursor: nextCursor || null,
      },
    };
  }
}
