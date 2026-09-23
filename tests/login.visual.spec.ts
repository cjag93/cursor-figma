import { test } from '@applitools/eyes-playwright/fixture';

test('login page', async ({ page, eyes }) => {
  await page.goto('/login');
  await eyes.check('Sign in form');

  await page.getByTestId('email-input').fill('wrong@example.com');
  await page.getByTestId('password-input').fill('badpassword');
  await page.getByTestId('login-button').click();
  await page.getByTestId('login-error').waitFor({ state: 'visible' });

  await eyes.check('Invalid credentials error');
});
