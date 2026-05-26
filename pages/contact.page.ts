import { expect, type Page } from '@playwright/test';

export class ContactPage {
  constructor(private readonly page: Page) {}

  async submitForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath: string;
  }): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();

    await expect(async () => {
      await this.fillForm(data);

      try {
        const dialogPromise = this.page.waitForEvent('dialog', { timeout: 2_500 });
        await Promise.all([
          dialogPromise.then(async dialog => {
            await expect(dialog.message()).toContain('Press OK to proceed!');
            await dialog.accept();
          }),
          this.page.getByRole('button', { name: 'Submit' }).click()
        ]);
        await expect(this.page.getByText('Success! Your details have been submitted successfully.').first()).toBeVisible();
      } catch (error) {
        await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
        throw error;
      }
    }).toPass({ timeout: 15_000 });
    await expect(this.page.getByText('Success! Your details have been submitted successfully.').first()).toBeVisible();
  }

  private async fillForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath: string;
  }): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
    await this.page.locator('input[name="name"]').fill(data.name);
    await this.page.locator('input[name="email"]').fill(data.email);
    await this.page.locator('input[name="subject"]').fill(data.subject);
    await this.page.locator('#message').fill(data.message);
    await this.page.locator('input[name="upload_file"]').setInputFiles(data.filePath);
  }

  async returnHome(): Promise<void> {
    await this.page.locator('a.btn-success').click();
    await expect(this.page.getByText('Full-Fledged practice website for Automation Engineers').first()).toBeVisible();
  }
}
