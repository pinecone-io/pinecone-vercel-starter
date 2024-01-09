import { expect, test } from '@playwright/test';
import { urls } from '../src/app/components/Sidebar/urls';

test('has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page).toHaveTitle('Pinecone - Vercel AI SDK Example')
})

test('renders clear index button', async ({ page }) => {
  await page.goto('http://localhost:3000')

  const clearIndexButton = await page.$('[data-testid="clear-button"]');
  const clearIndexButtonCount = clearIndexButton ? 1 : 0;
  await expect(clearIndexButtonCount).toBe(1)
})

test('Check Select menu', async ({ page }) => {
  // Go to your page
  await page.goto('http://localhost:3000');

  // Check if Select is visible
  const select = await page.locator('data-testid=url-selector');
  await expect(select).toBeVisible();

  // Click on the Select box and wait for it
  await select.click();
  await page.waitForTimeout(1000);

  // Check if MenuItems are rendered correctly
  for (let i = 0; i < urls.length; i++) {
    const menuItem = await page.locator(`div[data-testid="${urls[i].url}"]`);
    const title = await menuItem.locator('div').first().innerText();
    expect(title).toBe(urls[i].title); // The title should be the title of the entry
    const url = await menuItem.locator('div').last().innerText();
    expect(url).toBe(urls[i].url); // The url should be the url of the entry
  }
});


// TODO - add tests for other key buttons on the homepage

