import { test } from '@applitools/eyes-playwright/fixture';

const MATCH_LEVELS = ['Strict', 'Dynamic', 'Layout'] as const;

test.beforeEach(async ({ page }) => {
  // Pins the ticker, testimonial, session details and service notice so the only
  // differences between runs are code changes and the live clock.
  await page.addInitScript(() => {
    Math.random = () => 0.5;
  });
  await page.goto('/login');
  await page.evaluate(() => document.fonts.ready);
});

for (const matchLevel of MATCH_LEVELS) {
  test(`login page – ${matchLevel} match level`, async ({ eyes }) => {
    await eyes.check('Login page', { fully: true, matchLevel });
  });
}
