import { describe, it, expect, vi } from 'vitest';
import { getParsedPage, getPagination, type PaginationData } from './pagination';

describe('getParsedPage values', () => {
  const validPages = [1, 2, 10, '3', '100'];
  
  validPages.forEach((page) => {
    it(`should return ${Number(page)} for valid page input ${page}`, () => {
      const result = getParsedPage(page);
      expect(result).toBe(Number(page));
    });
  });

  const invalidPages = [0, -1, 1.5, 'a', {}, []];
  
  invalidPages.forEach((page) => {
    it(`should throw an error for invalid page input ${JSON.stringify(page)}`, () => {
      expect(() => getParsedPage(page))
        .toThrow(expect.objectContaining({ status: 400, body: { message: 'Page must be a positive integer' }}));
    });
  });
});

describe('getParsedPage defaults', () => {
  it('should return 1 for undefined page', () => {
    const result = getParsedPage(undefined);
    expect(result).toBe(1);
  });
});

describe('getPagination', () => {
  const testCases: { page: number; pageSize: number; totalItems: number; expected: PaginationData }[] = [
    { page: 1, pageSize: 10, totalItems: 100, expected: { page: 1, pageSize: 10, totalPages: 10, totalItems: 100 } },
    { page: 5, pageSize: 20, totalItems: 95, expected: { page: 5, pageSize: 20, totalPages: 5, totalItems: 95 } },
    { page: 3, pageSize: 15, totalItems: 45, expected: { page: 3, pageSize: 15, totalPages: 3, totalItems: 45 } },
  ];

  testCases.forEach(({ page, pageSize, totalItems, expected }) => {
    it(`should return correct pagination data for page=${page}, pageSize=${pageSize}, totalItems=${totalItems}`, () => {
      const result = getPagination(page, pageSize, totalItems);
      expect(result).toEqual(expected);
    });
  });
});