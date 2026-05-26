import { expect, test, type Page } from '@playwright/test';
import type { UserData } from '../utils/testData';

export class AccountPage {
  constructor(private readonly page: Page) {}

  async expectSignupVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async expectLoginVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }

  async startSignup(user: UserData): Promise<void> {
    await this.expectSignupVisible();
    await this.page.locator('[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('[data-qa="signup-email"]').fill(user.email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }

  async fillAccountInformation(user: UserData): Promise<void> {
    await expect(this.page.getByText('Enter Account Information')).toBeVisible();
    await this.page.locator(user.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await expect(this.page.locator('[data-qa="name"]')).toHaveValue(user.name);
    await expect(this.page.locator('[data-qa="email"]')).toHaveValue(user.email);
    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption(user.day);
    await this.page.locator('[data-qa="months"]').selectOption(user.month);
    await this.page.locator('[data-qa="years"]').selectOption(user.year);
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();
    await this.page.locator('[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastName);
    await this.page.locator('[data-qa="company"]').fill(user.company);
    await this.page.locator('[data-qa="address"]').fill(user.address);
    await this.page.locator('[data-qa="address2"]').fill(user.address2);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobileNumber);
  }

  async submitAccountCreation(): Promise<void> {
    await this.page.locator('[data-qa="create-account"]').click();
    await expect(this.page.locator('[data-qa="account-created"]')).toContainText('Account Created!');
  }

  async continueAfterAccountCreated(): Promise<void> {
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async registerUser(user: UserData): Promise<void> {
    await this.startSignup(user);
    await this.fillAccountInformation(user);
    await this.submitAccountCreation();
    await this.continueAfterAccountCreated();
    await this.expectLoggedInAs(user.name);
  }

  async login(email: string, password: string): Promise<void> {
    await this.expectLoginVisible();
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async expectLoggedInAs(username: string): Promise<void> {
    await expect(this.page.locator('a').filter({ hasText: `Logged in as ${username}` })).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.locator('a[href="/logout"]').click();
    await this.expectLoginVisible();
  }

  async deleteLoggedInAccount(): Promise<void> {
    await this.page.locator('a[href="/delete_account"]').click();
    await expect(this.page.locator('[data-qa="account-deleted"]')).toContainText('Account Deleted!');
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async expectExistingEmailError(): Promise<void> {
    await expect(this.page.getByText('Email Address already exist!')).toBeVisible();
  }

  async expectInvalidLoginError(): Promise<void> {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }

  async safeDeleteUser(user: UserData): Promise<void> {
    const cleanupErrors: string[] = [];

    try {
      if (await this.page.locator('a[href="/delete_account"]').isVisible({ timeout: 1_000 })) {
        await this.deleteLoggedInAccount();
        return;
      }
    } catch (error) {
      cleanupErrors.push(`delete current session: ${String(error)}`);
    }

    try {
      await this.page.goto('/login');
      await this.login(user.email, user.password);

      if (await this.page.locator('a[href="/delete_account"]').isVisible({ timeout: 3_000 })) {
        await this.deleteLoggedInAccount();
      }
    } catch (error) {
      cleanupErrors.push(`login and delete ${user.email}: ${String(error)}`);
    }

    if (cleanupErrors.length > 0) {
      await test.info().attach('cleanup-warning.txt', {
        body: cleanupErrors.join('\n'),
        contentType: 'text/plain'
      });
      test.info().annotations.push({
        type: 'cleanup-warning',
        description: cleanupErrors.join('\n')
      });
    }
  }
}
