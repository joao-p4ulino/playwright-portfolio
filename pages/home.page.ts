import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  private headerLink(href: string) {
    return this.page.locator('.navbar-nav').locator(`a[href="${href}"]`).first();
  }

  private async openHeaderPath(href: string, urlPattern: RegExp): Promise<void> {
    await Promise.all([
      this.page.waitForURL(urlPattern, { waitUntil: 'domcontentloaded', timeout: 7_500 }).catch(() => undefined),
      this.headerLink(href).click()
    ]);

    if (this.isGoogleVignette()) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded' });
    }

    await expect(this.page).toHaveURL(urlPattern);
  }

  private isGoogleVignette(): boolean {
    return this.page.url().includes('#google_vignette');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
    await expect(this.page.getByText('Full-Fledged practice website for Automation Engineers').first()).toBeVisible();
  }

  async openSignupLogin(): Promise<void> {
    await this.openHeaderPath('/login', /\/login$/);
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }

  async openProducts(): Promise<void> {
    await this.openHeaderPath('/products', /\/products$/);
    await expect(this.page.locator('h2.title.text-center').filter({ hasText: 'All Products' })).toBeVisible();
  }

  async openCart(): Promise<void> {
    await this.openHeaderPath('/view_cart', /\/view_cart$/);
    await expect(this.page.getByText('Shopping Cart')).toBeVisible();
  }

  async openContactUs(): Promise<void> {
    await this.openHeaderPath('/contact_us', /\/contact_us$/);
    await expect(this.page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
  }

  async openTestCases(): Promise<void> {
    await this.openHeaderPath('/test_cases', /\/test_cases$/);
    await expect(this.page.locator('h2.title.text-center').filter({ hasText: 'Test Cases' })).toBeVisible();
  }

  async subscribe(email: string): Promise<void> {
    await this.page.locator('#susbscribe_email').fill(email);
    await this.page.locator('#subscribe').click();
    await expect(this.page.locator('#success-subscribe')).toContainText('You have been successfully subscribed!');
  }

  async scrollToSubscription(): Promise<void> {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    await expect(this.page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
  }

  async expectHeroVisible(): Promise<void> {
    await expect(this.page.getByText('Full-Fledged practice website for Automation Engineers').first()).toBeVisible();
  }
}
