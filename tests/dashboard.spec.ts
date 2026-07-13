import { test, expect } from '@playwright/test';

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('displays account overview', async ({ page }) => {
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByTestId('welcome-message')).toContainText('demo@visionbank.com');
    await expect(page.getByTestId('stat-active-accounts')).toContainText('12,480');
    await expect(page.getByTestId('stat-pending-reviews')).toContainText('37');
    await expect(page.getByTestId('stat-success-rate')).toContainText('99.2%');
  });

  test('shows recent activity', async ({ page }) => {
    const activityList = page.getByTestId('activity-list');
    await expect(activityList).toContainText('Wire transfer approved');
    await expect(activityList).toContainText('New savings account opened');
    await expect(activityList).toContainText('Loan application submitted');
  });

  test('returns to login when signing out', async ({ page }) => {
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
