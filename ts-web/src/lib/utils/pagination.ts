import { error } from "@sveltejs/kit";

export interface PaginationData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export function getParsedPage(page?: any): number {
  // default to 1 if page is undefined or null
  if (page === undefined || page === null) {
    return 1;
  }
  // if page isn't a positive integer throw a 400 error
  const parsedPage = Number(page);
  if (isNaN(parsedPage) || parsedPage < 1 || !Number.isInteger(parsedPage)) {
    throw error(400, 'Page must be a positive integer');
  }

  return parsedPage;
}

export function getPagination(page: number, pageSize: number, totalItems: number): PaginationData {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalPages,
    totalItems
  };
}