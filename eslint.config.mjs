// Root ESLint flat config (ESLint 9). Each workspace package extends this.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/.astro/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.d.ts',
      // Tooling files outside any tsconfig project (script runners, vitest
      // bootstrap). Flat ESLint can't typed-lint these without a project
      // entry — exclude rather than fight the toolchain for one-off scripts.
      '**/*.config.{js,mjs,cjs,ts}',
      '.size-limit.cjs',
      '**/vitest.setup.ts',
      'scripts/**',
      'apps/docs/scripts/**',
      'apps/docs/registry/**',
      'packages/ui/scripts/**',
      'packages/core/scripts/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      'react/prop-types': 'off',
      'react/display-name': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  {
    // shadcn-style base UI primitives (installed via `npx shadcn init`)
    // ship with their own a11y/typing trade-offs that we don't want to
    // diverge from upstream. Relax rules for this path; we're consumers.
    files: ['apps/docs/src/components/ui/**'],
    rules: {
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/heading-has-content': 'off',
      'react/no-unknown-property': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
    },
  },
  {
    // Demo file containing live previews of every Nyxis component. The
    // ARIA roles, quoted placeholder text, and async-without-await are
    // intentional demo affordances, not production markup.
    files: ['apps/docs/src/components/demos/**'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'jsx-a11y/aria-role': 'off',
      '@typescript-eslint/require-await': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-console': 'off',
    },
  },
  {
    // External SDK wrappers — Vercel AI SDK returns `any` from
    // `streamText()` / `generateText()` etc. by design (the runtime
    // shape varies per provider). We accept that as the boundary and
    // relax unsafe-* rules only for files that interface with it.
    files: [
      'packages/core/src/server/**/*.ts',
      'packages/core/src/hooks/use-chat.ts',
      'packages/core/src/hooks/use-tool-executor.ts',
      'packages/core/src/adapters/provider-registry.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  prettierConfig,
);
