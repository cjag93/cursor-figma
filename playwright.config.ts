import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

// English-based steps only run in the project below, on Chromium.
const NLP_SPECS = /.*\.nlp\.spec\.ts/;

// A project's `use.eyesConfig` replaces this object rather than merging into it,
// so every project spreads it. `failTestsOnDiff` is spelled out because the
// per-test diff gate reads these values as written; the SDK's own default for it
// only reaches a separate worker-scoped copy.
const eyesConfig = {
  appName: 'VisionBank Demo',
  failTestsOnDiff: (process.env.CI ? 'afterAll' : 'afterEach') as 'afterAll' | 'afterEach',
};

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
    eyesConfig,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: NLP_SPECS,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: NLP_SPECS,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: NLP_SPECS,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chromium-nlp',
      testMatch: NLP_SPECS,
      use: {
        ...devices['Desktop Chrome'],
        // The SDK reads the debugging port back out of the browser's own command
        // line, which Chromium only returns when launched as an automation client.
        launchOptions: { args: ['--enable-automation'] },
        eyesConfig: {
          ...eyesConfig,
          nlpOptions: { enabled: true },
          batch: { name: 'VisionBank Demo - English-based steps' },
        },
      },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
