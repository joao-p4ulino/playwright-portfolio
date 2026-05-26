import { expect, test as base } from '@playwright/test';
import { blockThirdPartyNoise } from '../../utils/network';

const test = base.extend({});

test.beforeEach(async ({ page }) => {
  await blockThirdPartyNoise(page);
});

export { expect, test };
