import { AccountPage } from '../pages/account.page';
import { HomePage } from '../pages/home.page';
import { makeUserData } from '../utils/testData';
import { expect, test } from './fixtures/base';

test.describe('Automation Exercise official auth CT01-CT05', () => {
  test('CT01 - Register User', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const user = makeUserData('ct01');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.expectSignupVisible();
      await account.startSignup(user);
      await account.fillAccountInformation(user);
      await account.submitAccountCreation();
      await account.continueAfterAccountCreated();
      await account.expectLoggedInAs(user.name);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT02 - Login User with correct email and password', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const user = makeUserData('ct02');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await account.logout();
      await account.login(user.email, user.password);
      await account.expectLoggedInAs(user.name);
      await account.deleteLoggedInAccount();
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT03 - Login User with incorrect email and password', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);

    await home.goto();
    await home.openSignupLogin();
    await account.expectLoginVisible();
    await account.login('invalid-user@example.com', 'wrong-password');
    await account.expectInvalidLoginError();
  });

  test('CT04 - Logout User', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const user = makeUserData('ct04');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await account.logout();
      await expect(page).toHaveURL(/\/login$/);
      await account.login(user.email, user.password);
      await account.expectLoggedInAs(user.name);
      await account.logout();
      await expect(page).toHaveURL(/\/login$/);
    } finally {
      await account.safeDeleteUser(user);
    }
  });

  test('CT05 - Register User with existing email', async ({ page }) => {
    const home = new HomePage(page);
    const account = new AccountPage(page);
    const user = makeUserData('ct05');

    try {
      await home.goto();
      await home.openSignupLogin();
      await account.registerUser(user);
      await account.logout();
      await account.expectSignupVisible();
      await account.startSignup(user);
      await account.expectExistingEmailError();
    } finally {
      await account.safeDeleteUser(user);
    }
  });
});
