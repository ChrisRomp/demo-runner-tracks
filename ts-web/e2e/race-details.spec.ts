import { test } from '@playwright/test';
import { testPaginationNavigation, testDirectionButtonDisabled, testContentDifferentBetweenPages } from './test-utils/pagination';

test.describe('Paging for race participants', () => {
  const raceURL = '/race/1';

  test('pages from 1 to 2', async ({ page, baseURL }) => {
    await testPaginationNavigation({ 
      page, 
      baseURL: baseURL!, 
      pageURL: raceURL, 
      direction: 'next' 
    });
  });

  test('pages from 2 to 1', async ({ page, baseURL }) => {
    await testPaginationNavigation({ 
      page, 
      baseURL: baseURL!, 
      pageURL: raceURL, 
      direction: 'previous',
      startPage: 2 
    });
  });

  test('last page has next button disabled', async ({ page, baseURL }) => {
    await testDirectionButtonDisabled({ 
      page, 
      baseURL: baseURL!, 
      pageURL: raceURL, 
      direction: 'next' 
    });
  });

  test('first page has previous button disabled', async ({ page, baseURL }) => {
    await testDirectionButtonDisabled({ 
      page, 
      baseURL: baseURL!, 
      pageURL: raceURL, 
      direction: 'previous' 
    });
  });

  test('second page is different from first page', async ({ page, baseURL }) => {
    await testContentDifferentBetweenPages({ 
      page, 
      baseURL: baseURL!, 
      pageURL: raceURL,
      contentLabel: /Race Results/,
      direction: 'next'
    });
  });
});
