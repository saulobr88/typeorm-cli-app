/* eslint.config.js – Flat Config format (ESLint 9+) */
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  /* --------------------------------------------------
     1 ▸ Ignora pasta de build e dependências
  -------------------------------------------------- */
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  /* --------------------------------------------------
     2 ▸ Configuração para arquivos TypeScript
  -------------------------------------------------- */
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      prettier: pluginPrettier,
    },

    /* extensão das configs recomendadas */
    rules: {
      /* eslint:recommended via @eslint/js */
      ...js.configs.recommended.rules,

      /* @typescript-eslint recomendadas (sem e com type‑info) */
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,

      /* import plugin */
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,

      /* prettier plugin (desativa regras conflitantes e lança erro em formatação) */
      ...pluginPrettier.configs.recommended.rules,

      /* ===== Regras de projeto ===== */
      'prefer-const': 'error',

      /* ordenação automática de imports/exports */
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      /* ajustes TS */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'off',
    },

    /* resolutor de imports com aliases TypeScript */
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
