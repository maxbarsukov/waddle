module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },

  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  plugins: [
    '@typescript-eslint',
  ],
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
        functions: 'always-multiline',
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
    'no-console': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'operator-linebreak': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
  },
};
