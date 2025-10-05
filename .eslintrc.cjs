// Root ESLint config kept intentionally minimal; framework-specific (Next.js) configs live in each app
module.exports = {
  root: true,
  ignorePatterns: [
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
    '**/stories/**',
    'packages/ui/dist/**'
  ],
  env: { browser: true, es2022: true, node: true, jest: true },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: false }
    },
    {
      files: ['**/*.test.*', '**/__tests__/**'],
      rules: { 'no-console': 'off' }
    }
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
}