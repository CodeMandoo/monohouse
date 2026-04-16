import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export const sharedIgnores = {
  ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/auto-imports.d.ts'],
}

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
    },
  },
  sharedIgnores
)
