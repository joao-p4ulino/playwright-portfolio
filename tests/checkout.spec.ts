import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { makeUserData, paymentData, type UserData } from '../utils/testData';
import { test } from './fixtures/base';

async function addBlueTopAndOpenCart(home: HomePage, products: ProductsPage): Promise<void> {
  await home.goto();
  await products.addProductToCart(1);
  await products.viewCartFromModal();
}

async function placeOrderFromCheckout(checkout: CheckoutPage, user?: UserData): Promise<void> {
  await checkout.expectAddressDetailsAndOrderReview(user);
  await checkout.placeOrder('Order placed by Playwright portfolio suite.', paymentData);
}

test.describe('Automation Exercise official checkout CT14-CT16 CT23-CT24', () => {
  test('CT14 - Place Order: Register while Checkout', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const user = makeUserData('ct14');

    try {
      await addBlueTopAndOpenCart(home, products);
      await cart.proceedToCheckout();
      await cart.openRegisterLoginFromCheckoutModal();
      await account.registerUser(user);
      await home.openCart();
      await cart.proceedToCheckout();
      await placeOrderFromCheckout(checkout, user);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT15 - Place Order: Register before Checkout', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const user = makeUserData('ct15');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await products.addProductToCart(1);
      await products.viewCartFromModal();
      await cart.proceedToCheckout();
      await placeOrderFromCheckout(checkout, user);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT16 - Place Order: Login before Checkout', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const user = makeUserData('ct16');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await account.logout();
      await account.login(user.email, user.password);
      await account.expectLoggedInAs(user.name);
      await products.addProductToCart(1);
      await products.viewCartFromModal();
      await cart.proceedToCheckout();
      await placeOrderFromCheckout(checkout, user);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT23 - Verify address details in checkout page', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const user = makeUserData('ct23');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await products.addProductToCart(1);
      await products.viewCartFromModal();
      await cart.proceedToCheckout();
      await checkout.expectAddressDetailsAndOrderReview(user);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT24 - Download Invoice after purchase order', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const user = makeUserData('ct24');

    try {
      await addBlueTopAndOpenCart(home, products);
      await cart.proceedToCheckout();
      await cart.openRegisterLoginFromCheckoutModal();
      await account.registerUser(user);
      await home.openCart();
      await cart.proceedToCheckout();
      await placeOrderFromCheckout(checkout, user);
      await checkout.downloadInvoice();
      await checkout.continueAfterOrder();
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });
});
