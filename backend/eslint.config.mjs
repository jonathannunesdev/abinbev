import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          trailingComma: "all",
          arrowParens: "always",
          printWidth: 80,
          endOfLine: "lf",
        },
      ],
    },
    ignores: [
      "node_modules/**",
      "**/dist/**",
      "build/**",
      "public/**",
      ".next/**",
      "**/test/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/eslint.config.mjs",
      "ecosystem.config.js",
    ],
  },
);
