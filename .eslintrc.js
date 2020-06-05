module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],

  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    'semi': ['error', 'never'],
    'max-len': ['warn', 120],
    'quote-props': ['error', 'as-needed', { numbers: true }],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'never',
      },
    ],

    // Allow custom method chaining
    'newline-per-chained-call': 'off',

    // Allow to use const root = this
    '@typescript-eslint/no-this-alias': 'off',

    // Allow console.log statements
    'no-console': 'off',

    // I removed this because getters are getting a warning because of this rule
    'class-methods-use-this': 'off',

    // Allow names starting by underscore
    'no-underscore-dangle': 'off',

    // Allow for ... of ...
    'no-restricted-syntax': 'off',

    // Assigning to parameters is the basics of KoaJS
    'no-param-reassign': 'off',

    // Allow having only 1 export
    'import/prefer-default-export': 'off',

    // Don't use array destructuring for assignement expressions
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      },
      "AssignmentExpression": false
    }]

    // Tweaking @typescript-eslint
    '@typescript-eslint/member-delimiter-style': 'off', // No semi-colons in types
    '@typescript-eslint/explicit-function-return-type': 'off', // Don't force every function to have a return type
  },
}
