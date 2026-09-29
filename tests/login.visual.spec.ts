import { test } from '@applitools/eyes-playwright/fixture';

test.use({
  eyesConfig: {
    nlpOptions: { enabled: false },
    matchLevel: 'Dynamic',
  },
});

test('sign-in page with dynamic matching', async ({ page, eyes }) => {
  // Let the market ticker and clock vary so Eyes can learn layout regions for them.
  // Pin the variable-height notice and rotating copy so the page does not reflow.
  await page.addInitScript(() => {
    window.setInterval = (() => 0) as typeof setInterval;
  });

  await page.goto('/login');
  await page.evaluate(() => {
    const set = (name: string, value: string) => {
      document.querySelectorAll(`[data-live="${name}"]`).forEach((node) => {
        node.textContent = value;
      });
    };
    set('service-notice', 'Maintenance tonight 11pm–1am ET.');
    set(
      'quote-text',
      '“Onboarding our trustees took an afternoon instead of a quarter.”',
    );
    set('quote-author', 'Priya Raghunathan');
    set('quote-role', 'Director, Meridian Trust');
    set('quote-initials', 'PR');
    set('active-sessions', '1,400');
    set('last-scan', '30 minutes ago');
    set('session-ref', '7FFF-7FFF-7FFF');
  });

  await eyes.check('Sign in form', { fully: true });
});
