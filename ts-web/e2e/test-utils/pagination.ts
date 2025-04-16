import { Page, expect } from '@playwright/test';

interface BasePaginationTestOptions {
  page: Page;
  baseURL: string;
  pageURL: string;
  direction: 'next' | 'previous';
}

interface NavigationTestOptions extends BasePaginationTestOptions {
  startPage?: number;
}

interface PageContentTestOptions extends BasePaginationTestOptions {
  contentLabel: RegExp;
}

// --- Utility Functions ---

async function navigateToPage(page: Page, baseURL: string, pageURL: string, pageNumber?: number) {
  const url = new URL(pageURL, baseURL);
  if (pageNumber) {
    url.searchParams.set('page', pageNumber.toString());
  }
  await page.goto(url.toString());
}

async function getCurrentPage(page: Page): Promise<number> {
  const paginationText = await page.getByLabel('pagination').textContent();
  return parseInt(paginationText?.split('of')[0].split(' ')[1] || '1');
}

async function getTotalPages(page: Page): Promise<number> {
  const paginationText = await page.getByLabel('pagination').textContent();
  return parseInt(paginationText?.split('of')[1] || '0');
}

async function verifyPageNumber(page: Page, expectedPage: number) {
  await expect(page.getByLabel('pagination')).toContainText(`Page ${expectedPage} of`);
}

async function getPaginationButton(page: Page, direction: 'next' | 'previous') {
  return page.getByRole('button', { name: direction === 'next' ? 'Next' : 'Previous' });
}

// --- Main Functions ---

export async function testPaginationNavigation({ page, baseURL, pageURL, direction, startPage }: NavigationTestOptions) {
  await navigateToPage(page, baseURL, pageURL, startPage);
  const expectedPage = direction === 'next' ? (startPage || 1) + 1 : (startPage || 1) - 1;
  
  const button = await getPaginationButton(page, direction);
  await button.click();
  await verifyPageNumber(page, expectedPage);
}

export async function testDirectionButtonDisabled({page, baseURL, pageURL, direction}: BasePaginationTestOptions) {
  await navigateToPage(page, baseURL, pageURL);
  
  if (direction === 'next') {
    const totalPages = await getTotalPages(page);
    await navigateToPage(page, baseURL, pageURL, totalPages);
    await verifyPageNumber(page, totalPages);
  }

  const button = await getPaginationButton(page, direction);
  await expect(button).toBeDisabled();
}

export async function testContentDifferentBetweenPages({ page, baseURL, pageURL, contentLabel, direction }: PageContentTestOptions) {
  await navigateToPage(page, baseURL, pageURL);
  const firstPageContent = await page.getByLabel(contentLabel).textContent();
  const startPage = await getCurrentPage(page);

  const button = await getPaginationButton(page, direction);
  await button.click();

  const expectedPage = direction === 'next' ? startPage + 1 : startPage - 1;
  await verifyPageNumber(page, expectedPage);

  const secondPageContent = await page.getByLabel(contentLabel).textContent();
  await expect(firstPageContent).not.toEqual(secondPageContent);
}