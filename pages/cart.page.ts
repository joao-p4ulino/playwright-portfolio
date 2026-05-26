import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectDisplayed(): Promise<void> {
    await expect(this.page.getByText('Shopping Cart')).toBeVisible();
  }

  async expectProduct(productId: number, productName: string): Promise<void> {
    const row = this.page.locator(`#product-${productId}`);
    await expect(row).toBeVisible();
    await expect(row).toContainText(productName);
  }

  async expectProductQuantity(productId: number, quantity: string): Promise<void> {
    await expect(this.page.locator(`#product-${productId} .cart_quantity button`)).toHaveText(quantity);
  }

  async removeProduct(productId: number): Promise<void> {
    await this.page.locator(`#product-${productId} .cart_quantity_delete`).click();
    await expect(this.page.locator(`#product-${productId}`)).toHaveCount(0);
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.page.getByText('Cart is empty!')).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.expectDisplayed();
    await this.page.locator('a.check_out').click();
  }

  async openRegisterLoginFromCheckoutModal(): Promise<void> {
    await expect(this.page.getByText('Register / Login account to proceed on checkout.')).toBeVisible();
    await this.page.locator('.modal-content a[href="/login"]').click();
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }
}
