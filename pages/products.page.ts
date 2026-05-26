import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async expectAllProductsVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(this.productCards().first()).toBeVisible();
  }

  productCards(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  productRow(productId: number): Locator {
    return this.page.locator(`.product-image-wrapper:has(a[data-product-id="${productId}"])`).first();
  }

  async viewProduct(productId: number): Promise<void> {
    const path = `/product_details/${productId}`;
    await Promise.all([
      this.page.waitForURL(new RegExp(`${path}$`), { waitUntil: 'domcontentloaded', timeout: 7_500 }).catch(() => undefined),
      this.page.locator(`a[href="${path}"]`).click()
    ]);

    if (this.isGoogleVignette()) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    }

    await expect(this.page).toHaveURL(new RegExp(`${path}$`));
  }

  async expectProductDetails(productName: string): Promise<void> {
    await expect(this.page.locator('.product-information h2')).toHaveText(productName);
    await expect(this.page.getByText(/Category:/)).toBeVisible();
    await expect(this.page.getByText(/Availability:/)).toBeVisible();
    await expect(this.page.getByText(/Condition:/)).toBeVisible();
    await expect(this.page.getByText(/Brand:/)).toBeVisible();
  }

  async search(productName: string): Promise<void> {
    await this.page.locator('#search_product').fill(productName);
    await this.page.locator('#submit_search').click();
    await expect(this.page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
  }

  async expectSearchResult(productName: string): Promise<void> {
    await expect(this.productCards().filter({ hasText: productName }).first()).toBeVisible();
  }

  async addProductToCart(productId: number): Promise<void> {
    await this.page.locator(`a[data-product-id="${productId}"]`).first().click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeVisible();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeHidden();
  }

  async viewCartFromModal(): Promise<void> {
    await this.page.locator('.modal-content a[href="/view_cart"]').click();
    await expect(this.page.getByText('Shopping Cart')).toBeVisible();
  }

  async setProductQuantity(quantity: string): Promise<void> {
    await this.page.locator('#quantity').fill(quantity);
  }

  async addDetailedProductToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeVisible();
  }

  async openWomenDressCategory(): Promise<void> {
    await this.page.locator('a[href="#Women"]').click();
    const dressLink = this.page.locator('#Women a[href="/category_products/1"]');
    await expect(dressLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/\/category_products\/1$/, { waitUntil: 'domcontentloaded', timeout: 7_500 }).catch(() => undefined),
      dressLink.click()
    ]);
    if (this.isGoogleVignette()) {
      await this.page.goto('/category_products/1', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/category_products\/1$/);
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  async openMenTshirtsCategory(): Promise<void> {
    await this.page.locator('a[href="#Men"]').click();
    const tshirtsLink = this.page.locator('#Men a[href="/category_products/3"]');
    await expect(tshirtsLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/\/category_products\/3$/, { waitUntil: 'domcontentloaded', timeout: 7_500 }).catch(() => undefined),
      tshirtsLink.click()
    ]);
    if (this.isGoogleVignette()) {
      await this.page.goto('/category_products/3', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.page).toHaveURL(/\/category_products\/3$/);
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  private isGoogleVignette(): boolean {
    return this.page.url().includes('#google_vignette');
  }

  async openPoloBrand(): Promise<void> {
    await this.page.locator('a[href="/brand_products/Polo"]').click();
    await expect(this.page.getByRole('heading', { name: 'Brand - Polo Products' })).toBeVisible();
  }

  async openHmBrand(): Promise<void> {
    await this.page.locator('a[href="/brand_products/H&M"]').click();
    await expect(this.page.getByRole('heading', { name: 'Brand - H&M Products' })).toBeVisible();
  }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    await expect(this.page.getByText('Write Your Review')).toBeVisible();
    await this.page.locator('#name').fill(name);
    await this.page.locator('#email').fill(email);
    await this.page.locator('#review').fill(review);
    await this.page.locator('#button-review').click();
    await expect(this.page.getByText('Thank you for your review.')).toBeVisible();
  }

  async addRecommendedItemToCart(): Promise<void> {
    await this.page.locator('.recommended_items').scrollIntoViewIfNeeded();
    await expect(this.page.getByRole('heading', { name: 'Recommended Items' })).toBeVisible();
    await this.page.locator('#recommended-item-carousel a[data-product-id]').first().click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeVisible();
  }
}
