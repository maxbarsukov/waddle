module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'arrow-parens': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'never',
        functions: 'never',
      },
    ],
    'object-curly-newline': 'off',
    'no-mixed-operators': 'off',
    'arrow-body-style': 'off',
    'function-paren-newline': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'warn',
    'space-before-function-paren': 0,
    'no-underscore-dangle': 'warn',
    'max-len': ['warn', 100, 2, { ignoreUrls: true }],
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'operator-linebreak': 'off',
  },
};
