import type { EyesConfig } from '@applitools/eyes-playwright/fixture';

declare module '@playwright/test' {
  interface PlaywrightTestOptions {
    eyesConfig?: EyesConfig;
  }

  interface PlaywrightWorkerOptions {
    eyesConfig?: EyesConfig;
  }
}
