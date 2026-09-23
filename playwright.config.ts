import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const FIGMA_LOGIN =
  'https://www.figma.com/design/deHkeywzAFHk31O9GJGLK2/Chandan-Jagdeesh-s-team-library?node-id=3337-72';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    eyesConfig: {
      appName: 'VisionBank Demo',
      // Playwright Fixtures: key is the test() title Eyes opens with.
      // Unmapped tests (login page, dashboard, …) stay ordinary regressions.
      figmaBaselines: {
        'AEO-Test login vs Figma': FIGMA_LOGIN,
      },
      figmaOptions: {
        mode: process.env.CI ? 'disabled' : 'auto-baseline',
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
