// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
    nuxt: {
      sortConfigKeys: true,
    },
  },
  dirs: {
    src: [
      './***/*.{vue,ts}',
    ],
  },
})
  .append({
    rules: {
      semi: ['error', 'always'],
      '@stylistic/semi': 'off',
      '@stylistic/quote-props': ['error', 'as-needed'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    },
  });
