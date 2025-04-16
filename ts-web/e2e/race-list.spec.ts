import { test, expect } from '@playwright/test';
import { 
  testPaginationNavigation, 
  testDirectionButtonDisabled, 
  testContentDifferentBetweenPages 
} from './test-utils/pagination';

test.describe('Race list pagination', () => {
  const pageURL = '/';

  test('navigates forward from page 1 to 2', async ({ page, baseURL }) => {
    await testPaginationNavigation({ 
      page, 
      baseURL: baseURL!, 
      pageURL, 
      direction: 'next' 
    });
  });

  test('navigates backward from page 2 to 1', async ({ page, baseURL }) => {
    await testPaginationNavigation({ 
      page, 
      baseURL: baseURL!, 
      pageURL, 
      startPage: 2, 
      direction: 'previous' 
    });
  });

  test('disables next button on last page', async ({ page, baseURL }) => {
    await testDirectionButtonDisabled({ 
      page, 
      baseURL: baseURL!, 
      pageURL, 
      direction: 'next' 
    });
  });

  test('disables previous button on first page', async ({ page, baseURL }) => {
    await testDirectionButtonDisabled({ 
      page, 
      baseURL: baseURL!, 
      pageURL, 
      direction: 'previous' 
    });
  });

  test('shows different content between pages', async ({ page, baseURL }) => {
    await testContentDifferentBetweenPages({ 
      page, 
      baseURL: baseURL!, 
      pageURL, 
      contentLabel: /race-list/, 
      direction: 'next' 
    });
  });
});
