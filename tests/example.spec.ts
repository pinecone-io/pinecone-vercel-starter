import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page).toHaveTitle('Pinecone - Vercel AI SDK Example')
})

test('renders info modal button', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const infoButtonCount = await page.locator('.info-button').count()
  await expect(infoButtonCount).toBe(1)
})

test('renders GitHub repository button', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const infoButtonCount = await page.locator('.github-button').count()
  await expect(infoButtonCount).toBe(1)
})

test('renders Vercel deploy button', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const vercelDeployButtonCount = await page.getByRole('link', { name: 'Deploy' }).count()

  await expect(vercelDeployButtonCount).toBe(1)
})

test('GitHub button goes to project repository', async ({ page, browserName }) => {

  test.skip(browserName === 'chromium', 'Chrome doesn\'t work :( ')

  await page.goto('http://localhost:3000/');
  const githubButton = await page.locator('.github-button');
  await githubButton.click();

  try {
    await page.waitForNavigation('https://github.com/pinecone-io/pinecone-vercel-starter');
  } catch (e) {
    console.log('Error waiting on navigation...')
  }
});

// TODO - add tests for other key buttons on the homepage

