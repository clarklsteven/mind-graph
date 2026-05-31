// eslint.config.mjs
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/out/**"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/consistent-type-imports": "warn"
        }
    }
);