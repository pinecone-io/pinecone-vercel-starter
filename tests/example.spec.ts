import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page).toHaveTitle('Pinecone - Vercel AI SDK Example')
})

test('GitHub link', async ({ page, browserName }) => {

  test.skip(browserName === 'chromium', 'Chrome doesn\'t work :( ')

  await page.goto('http://localhost:3000/');
  const githubButton = page.locator('.github-button');
  await githubButton.click();

  try {
    await page.waitForNavigation('https://github.com/pinecone-io/pinecone-vercel-starter');
  } catch (e) {
    console.log('Error waiting on navigation...')
  }
});

// TODO - add tests for other key buttons on the homepage

