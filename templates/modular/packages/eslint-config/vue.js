import prettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

import baseConfig, { sharedIgnores } from './index.js'

export default tseslint.config(
  baseConfig,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  sharedIgnores
)
