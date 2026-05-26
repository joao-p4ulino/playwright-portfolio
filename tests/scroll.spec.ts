import { HomePage } from '../pages/home.page';
import { expect, test } from './fixtures/base';

test.describe('Automation Exercise official scroll CT25-CT26', () => {
  test('CT25 - Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.scrollToSubscription();
    await expect(page.locator('#scrollUp')).toBeVisible();
    await page.locator('#scrollUp').click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
    await home.expectHeroVisible();
  });

  test('CT26 - Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.scrollToSubscription();
    await page.evaluate(() => window.scrollTo(0, 0));
    await home.expectHeroVisible();
  });
});
