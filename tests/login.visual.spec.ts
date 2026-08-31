import { test } from '@applitools/eyes-playwright/fixture';

test('sign-in page with live content', async ({ page, eyes }) => {
  await page.goto('/login');
  // The page is taller than the viewport, so capture it fully.
  await eyes.check('Sign in form', { fully: true });

  await page.getByTestId('email-input').fill('wrong@example.com');
  await page.getByTestId('password-input').fill('badpassword');
  await page.getByTestId('login-button').click();
  await page.getByTestId('login-error').waitFor({ state: 'visible' });

  await eyes.check('Invalid credentials error', { fully: true });
});
