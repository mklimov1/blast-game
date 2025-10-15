// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['node_modules/**', 'dist/**', 'src/shared/generated/**', '.assetpack/**']),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,mts,cts}', 'config/**/*.{ts,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: pluginImport,
    },
    rules: {
      'semi': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      '@typescript-eslint/no-unused-vars': 'error',
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'lines-between-class-members': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'padding-line-between-statements': [
        'error',
        { 'blankLine': 'always', 'prev': 'return', 'next': '*' },
        { 'blankLine': 'any', 'prev': 'block-like', 'next': '*' },
        { 'blankLine': 'any', 'prev': '*', 'next': 'block-like' },
      ],
      'key-spacing': [2, {
        'singleLine': {
          'beforeColon': false,
          'afterColon': true,
        },
        'multiLine': {
          'beforeColon': false,
          'afterColon': true,
        },
      }],

      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      }],

      'max-len': ['error', {
        'code': 100,
        'tabWidth': 2,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      }],

      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'quotes': ['error', 'single'],
    },
  },
);
