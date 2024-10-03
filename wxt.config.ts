import { defineConfig, UserConfig } from 'wxt';

export default defineConfig({
  manifest: {
    permissions: [
      "activeTab"
    ],
    host_permissions: [
      "https://www.linkedin.com/*"
    ],
  },
  content: {
    defaultFilename: 'entrypoints/content.ts',
    matches: ['https://www.linkedin.com/*'],
  },
} as UserConfig);