// .eslintrc.js
export default {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended", // Integrates Prettier with ESLint
  ],
  rules: {
    // Core best practices
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "off", // You can turn this on in production if needed
    "no-undef": "error",
    "prefer-const": "warn",

    // Prettier rules
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        semi: true,
        tabWidth: 2,
        trailingComma: "es5",
        bracketSpacing: true,
        printWidth: 100,
        arrowParens: "always",
      },
    ],
  },
  ignorePatterns: ["node_modules", "dist", "build", "logs"],
};
