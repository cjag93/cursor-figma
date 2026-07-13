import type { EyesConfig } from '@applitools/eyes-playwright/fixture';

declare module '@playwright/test' {
  interface PlaywrightTestOptions {
    eyesConfig?: EyesConfig;
    figmaBaselines?: Record<string, string | string[]>;
  }

  interface PlaywrightWorkerOptions {
    eyesConfig?: EyesConfig;
    figmaBaselines?: Record<string, string | string[]>;
  }
}
