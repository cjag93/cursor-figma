import { test } from '@applitools/eyes-playwright/fixture';

// Eyes test name must match the figmaBaselines key in playwright.config.ts.
test('AEO-Test login vs Figma', async ({ page, eyes }) => {
  await page.goto('/login');
  await eyes.check('Login form');
});
