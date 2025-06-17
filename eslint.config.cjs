// eslint.config.cjs – Flat Config in CommonJS, no ESM warning
const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const pluginImport = require('eslint-plugin-import');
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort');
const pluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');

/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  /* --------------------------------------------------
     1 ▸ Arquivos ignorados (build, deps)
  -------------------------------------------------- */
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  /* --------------------------------------------------
     2 ▸ Regras/Plugins para arquivos TS/TSX
  -------------------------------------------------- */
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      prettier: pluginPrettier,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,
      ...pluginPrettier.configs.recommended.rules,

      'prefer-const': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'prettier/prettier': 'error',
    },

    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
  },
];
