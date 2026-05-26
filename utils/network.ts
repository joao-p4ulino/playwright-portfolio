import type { Page } from '@playwright/test';

const THIRD_PARTY_NOISE =
  /googlesyndication|googleadservices|googleads|doubleclick|googletagmanager|googletagservices|google-analytics|pagead2|pagead|adsbygoogle|fundingchoicesmessages|2mdn\.net|adtrafficquality|facebook|twitter/i;

export async function blockThirdPartyNoise(page: Page): Promise<void> {
  await page.route(THIRD_PARTY_NOISE, async route => {
    await route.abort().catch(() => undefined);
  });

  await page.addInitScript(() => {
    Object.defineProperty(window, 'adsbygoogle', {
      value: [],
      writable: false
    });
  });
}
