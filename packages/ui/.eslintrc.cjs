// UI package ESLint config for TypeScript/React
module.exports = {
  root: true,
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    '*.js',
    '*.cjs',
    '*.mjs',
    '*.d.ts',
    '*.test.js',
    '*.test.cjs',
    '*.test.mjs',
    '*.stories.*',
    '*.config.js',
    '*.config.cjs',
    '*.config.mjs',
    'node_modules/**',
  ],
  env: { browser: true, es2022: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'prettier'
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    react: { version: 'detect' }
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      env: { jest: true },
      plugins: ['jest', 'testing-library', 'jest-dom'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended'
      ]
    }
  ]
}