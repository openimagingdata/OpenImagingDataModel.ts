// eslint-disable-next-line n/no-extraneous-import
import eslint from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import jsdoc from 'eslint-plugin-jsdoc';
import n from 'eslint-plugin-n';
import * as regexp from 'eslint-plugin-regexp';
import vitest from 'eslint-plugin-vitest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'coverage*',
      'lib',
      'node_modules',
      'pnpm-lock.yaml',
      '**/*.snap',
      '**/*.test.ts', // Ignore test files
      '**/*.spec.ts', // Ignore spec files if applicable
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  eslint.configs.recommended,
  comments.recommended,
  jsdoc.configs['flat/recommended-typescript-error'],
  n.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  ...tseslint.config({
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        EXPERIMENTAL_useProjectService: {
          allowDefaultProjectForFiles: ['./*.*s', 'eslint.config.js'],
          defaultProject: './tsconfig.json',
        },
      },
    },
    rules: {
      // These off-by-default rules work well for this repo and we like them on.
      'jsdoc/informative-docs': 'error',
      'logical-assignment-operators': [
        'error',
        'always',
        { enforceForIfStatements: true },
      ],
      'operator-assignment': 'error',

      // These on-by-default rules don't work well for this repo and we like them off.
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-property': 'off',
      'jsdoc/require-returns': 'off',
      'no-constant-condition': 'off',

      // These on-by-default rules work well for this repo if configured
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'all' }],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: true },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowBoolean: true, allowNullish: true, allowNumber: true },
      ],

      // Stylistic concerns that don't interfere with Prettier
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
    },
  }),
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.md/*.ts'],
    rules: {
      'n/no-missing-import': [
        'error',
        { allowModules: ['openimagingdatamodel-ts'] },
      ],
    },
  },
  {
    files: ['**/*.test.*'],
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,

      // These on-by-default rules aren't useful in test files.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
);
