import { expect, type Page } from '@playwright/test';
import type { PaymentData, UserData } from '../utils/testData';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectAddressDetailsAndOrderReview(user?: UserData): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();

    if (user) {
      const fullName = `${user.title}. ${user.firstName} ${user.lastName}`;
      await expect(this.page.locator('#address_delivery')).toContainText(fullName);
      await expect(this.page.locator('#address_delivery')).toContainText(user.company);
      await expect(this.page.locator('#address_delivery')).toContainText(user.address);
      await expect(this.page.locator('#address_delivery')).toContainText(user.address2);
      await expect(this.page.locator('#address_delivery')).toContainText(user.city);
      await expect(this.page.locator('#address_delivery')).toContainText(user.state);
      await expect(this.page.locator('#address_delivery')).toContainText(user.zipcode);
      await expect(this.page.locator('#address_delivery')).toContainText(user.country);
      await expect(this.page.locator('#address_delivery')).toContainText(user.mobileNumber);
      await expect(this.page.locator('#address_invoice')).toContainText(fullName);
    }
  }

  async placeOrder(comment: string, payment: PaymentData): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.locator('a[href="/payment"]').click();
    await this.page.locator('[data-qa="name-on-card"]').fill(payment.nameOnCard);
    await this.page.locator('[data-qa="card-number"]').fill(payment.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(payment.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(payment.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(payment.expiryYear);
    await this.page.locator('[data-qa="pay-button"]').click();
    await this.expectOrderPlaced();
  }

  async expectOrderPlaced(): Promise<void> {
    await expect(this.page.locator('[data-qa="order-placed"]')).toContainText(/Order Placed!/i);
    await expect(
      this.page.getByText(/Your order has been placed successfully!|Congratulations! Your order has been confirmed!/i)
    ).toBeVisible();
  }

  async downloadInvoice(): Promise<void> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.locator('a[href^="/download_invoice"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/invoice/i);
  }

  async continueAfterOrder(): Promise<void> {
    await this.page.locator('[data-qa="continue-button"]').click();
  }
}
