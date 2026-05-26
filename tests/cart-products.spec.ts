import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { makeUserData } from '../utils/testData';
import { test } from './fixtures/base';

test.describe('Automation Exercise official cart and product CT12-CT13 CT17-CT22', () => {
  test('CT12 - Add Products in Cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.openProducts();
    await products.addProductToCart(1);
    await products.continueShopping();
    await products.addProductToCart(2);
    await products.viewCartFromModal();
    await cart.expectProduct(1, 'Blue Top');
    await cart.expectProduct(2, 'Men Tshirt');
    await cart.expectProductQuantity(1, '1');
    await cart.expectProductQuantity(2, '1');
  });

  test('CT13 - Verify Product quantity in Cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await products.viewProduct(1);
    await products.expectProductDetails('Blue Top');
    await products.setProductQuantity('4');
    await products.addDetailedProductToCart();
    await products.viewCartFromModal();
    await cart.expectProduct(1, 'Blue Top');
    await cart.expectProductQuantity(1, '4');
  });

  test('CT17 - Remove Products From Cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await products.addProductToCart(1);
    await products.viewCartFromModal();
    await cart.expectProduct(1, 'Blue Top');
    await cart.removeProduct(1);
    await cart.expectCartEmpty();
  });

  test('CT18 - View Category Products', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await products.openWomenDressCategory();
    await products.openMenTshirtsCategory();
  });

  test('CT19 - View and Cart Brand Products', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.openProducts();
    await products.openPoloBrand();
    await products.expectSearchResult('Blue Top');
    await products.openHmBrand();
    await products.expectSearchResult('Men Tshirt');
  });

  test('CT20 - Search Products and Verify Cart After Login', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const user = makeUserData('ct20');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await account.logout();
      await home.openProducts();
      await products.search('Blue Top');
      await products.expectSearchResult('Blue Top');
      await products.addProductToCart(1);
      await products.viewCartFromModal();
      await cart.expectProduct(1, 'Blue Top');
      await home.openSignupLogin();
      await account.login(user.email, user.password);
      await account.expectLoggedInAs(user.name);
      await home.openCart();
      await cart.expectProduct(1, 'Blue Top');
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT21 - Add review on product', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const user = makeUserData('ct21');

    await home.goto();
    await home.openProducts();
    await products.expectAllProductsVisible();
    await products.viewProduct(1);
    await products.submitReview(user.name, user.email, 'Blue Top is reviewed by the portfolio suite.');
  });

  test('CT22 - Add to cart from Recommended items', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await products.addRecommendedItemToCart();
    await products.viewCartFromModal();
    await cart.expectDisplayed();
    await cart.expectProduct(1, 'Blue Top');
  });
});
