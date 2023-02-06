module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'prettier/prettier': 0,
    'react/jsx-filename-extension': 0,
    'import/prefer-default-export': 0,
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-use-before-define': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/forbid-prop-types': 'off',
    camelcase: 'off',
    // eslint-disable-next-line no-dupe-keys
    'react-hooks/exhaustive-deps': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
