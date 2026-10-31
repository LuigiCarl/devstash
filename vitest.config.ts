import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Include only unit test files (you can adjust the glob as needed)
    include: ['tests/**/*.test.{ts,tsx,js,jsx}'],
    // Explicitly exclude e2e Playwright tests
    exclude: ['tests/e2e/**'],
    // Use the same environment as your project (jsdom for React components)
    environment: 'jsdom',
  },
});

