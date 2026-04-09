import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  webServer: {
    command: 'npm start',
    url: 'http://localhost:5000/',
    reuseExistingServer: true
  },
  use: {
    baseURL: 'http://localhost:5000/',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', 
    trace: 'retain-on-failure',
  },
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'], },
  //     dependencies:[
  //       'auth-setup'
  //     ]
  //   },
  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //     dependencies:[
  //       'auth-setup'
  //     ]
  //   },
  //   {
  //     name: 'auth-setup',
  //     testMatch: 'tests/setup/Auth.setup.ts',
  //   }
  // ]

});
