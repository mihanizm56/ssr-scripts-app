module.exports = {
  extends: ['@wildberries'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    __DEV__: true,
    __SERVER__: false,
    __CLIENT__: false,
    location: false,
    env: false,
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    camelcase: 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
  },
};
