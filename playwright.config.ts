import 'dotenv/config';
import { execSync } from 'node:child_process';
import { defineConfig, devices } from '@playwright/test';

// English-based steps only run in the project below, on Chromium.
const NLP_SPECS = /.*\.nlp\.spec\.ts/;

// The Eyes baseline every other branch is compared against.
const BASELINE_BRANCH = 'tests';

function currentGitBranch(): string | undefined {
  // GITHUB_HEAD_REF is the PR's source branch; GITHUB_REF_NAME is the pushed branch.
  const fromCi = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  if (fromCi) return fromCi;
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch && branch !== 'HEAD' ? branch : undefined;
  } catch {
    return undefined;
  }
}

const gitBranch = process.env.APPLITOOLS_BRANCH || currentGitBranch() || BASELINE_BRANCH;

// On the baseline branch, CI runs refresh the baseline: new tests and diffs are
// saved automatically and never fail the run. Every other branch compares
// against the latest baseline-branch baseline, ignoring anything accepted on
// itself, so a PR always shows its difference from the baseline branch.
const branchConfig =
  gitBranch === BASELINE_BRANCH
    ? {
        branchName: BASELINE_BRANCH,
        ...(process.env.CI && {
          saveNewTests: true,
          saveDiffs: true,
          failTestsOnDiff: false as const,
        }),
      }
    : {
        branchName: gitBranch,
        parentBranchName: BASELINE_BRANCH,
        compareWithParentBranch: true,
        ignoreGitMergeBase: true,
      };

// A project's `use.eyesConfig` replaces this object rather than merging into it,
// so every project spreads it. `failTestsOnDiff` is spelled out because the
// per-test diff gate reads these values as written; the SDK's own default for it
// only reaches a separate worker-scoped copy.
const eyesConfig = {
  appName: 'VisionBank Demo',
  failTestsOnDiff: (process.env.CI ? 'afterAll' : 'afterEach') as 'afterAll' | 'afterEach' | false,
  ...branchConfig,
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['@applitools/eyes-playwright/reporter'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    eyesConfig: {
      appName: 'VisionBank Portal',
      ...branchConfig,
    },
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
