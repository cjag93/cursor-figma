import { test } from '@applitools/eyes-playwright/fixture';
import type { Eyes as BaseEyes } from '@applitools/eyes-playwright';
import { setFigmaBaseline } from 'adams-skills/figma';

let figmaBaselines: Record<string, string | string[]> | undefined;

test.beforeEach(async ({ eyes }, testInfo) => {
  figmaBaselines ??= (testInfo.project.use as { figmaBaselines?: Record<string, string | string[]> }).figmaBaselines ?? {};
  await setFigmaBaseline((eyes as unknown as BaseEyes).configuration, figmaBaselines, {
    configFilePath: testInfo.config.configFile,
  });
});

test('login page', async ({ page, eyes }) => {
  await page.goto('/login');
  await eyes.check('Sign in form');

  await page.getByTestId('email-input').fill('wrong@example.com');
  await page.getByTestId('password-input').fill('badpassword');
  await page.getByTestId('login-button').click();
  await page.getByTestId('login-error').waitFor({ state: 'visible' });

  await eyes.check('Invalid credentials error');
});
