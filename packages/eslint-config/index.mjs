import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export function createTypeScriptConfig({ tsconfigRootDir }) {
  return tseslint.config(
    {
      ignores: [
        '**/coverage/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/*.d.ts',
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
    ...tseslint.configs.stylisticTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
    {
      files: ['**/*.ts'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports' },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
    {
      files: ['**/*.module.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 'off',
      },
    },
  );
}
