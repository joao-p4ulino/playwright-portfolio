import path from 'node:path';
import { ContactPage } from '../pages/contact.page';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { makeUserData } from '../utils/testData';
import { expect, test } from './fixtures/base';

test.describe('Automation Exercise official content CT06-CT11', () => {
  test('CT06 - Contact Us Form', async ({ page }) => {
    const home = new HomePage(page);
    const contact = new ContactPage(page);
    const filePath = path.resolve(__dirname, 'fixtures/contact-upload.txt');

    await home.goto();
    await home.openContactUs();
    await contact.submitForm({
      name: 'Portfolio Contact',
      email: makeUserData('ct06').email,
      subject: 'Automation Exercise CT06',
      message: 'Contact form validation from Playwright portfolio suite.',
      filePath
    });
    await contact.returnHome();
  });

  test('CT07 - Verify Test Cases Page', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.openTestCases();
    await expect(page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  });

  test('CT08 - Verify All Products and product detail page', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.openProducts();
    await products.expectAllProductsVisible();
    await products.viewProduct(1);
    await products.expectProductDetails('Blue Top');
  });

  test('CT09 - Search Product', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.openProducts();
    await products.expectAllProductsVisible();
    await products.search('Blue Top');
    await products.expectSearchResult('Blue Top');
  });

  test('CT10 - Verify Subscription in home page', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.scrollToSubscription();
    await home.subscribe(makeUserData('ct10').email);
  });

  test('CT11 - Verify Subscription in Cart page', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.openCart();
    await home.scrollToSubscription();
    await home.subscribe(makeUserData('ct11').email);
  });
});
