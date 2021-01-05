module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['simple-import-sort', '@typescript-eslint', 'import'],

  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  settings: {
    'import/resolver': {
      typescript: {}
    }
  },

  rules: {
    'semi': ['error', 'never'],
    'max-len': ['warn', 200],
    'quote-props': ['error', 'as-needed', { numbers: true }],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'never',
      },
    ],

    // Force LF newlines
    'linebreak-style': ['error', 'unix'],

    // Forces `import type` when possible
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // Import sorting
    'simple-import-sort/imports': ['error', {
      groups: [
        // Side effect imports.
        ["^\\u0000"],
        // Packages.
        [
          // Things that start with a letter (or digit or underscore), or `@`.
          "^\\w",
          // Things that start with `@` not followed by a letter, such as Vue-style `@/foo`.
          "^@[^\\w]",
          // Things that start with `@` followed by a letter.
          "^@\\w",
        ],
        // Absolute imports and other imports such as Vue-style `@/foo`.
        // Anything not matched in another group
        ["^"],
        // Relative imports.
        // Anything that starts with a dot.
        ["^\\."],

        // Type imports all ends with \u0000
        [
          // Packages.
          // Things that start with a letter (or digit or underscore)
          "^\\w.*\u0000",
          // Things that start with `@` not followed by a letter, such as Vue-style `@/foo`.
          "^@[^\\w].*\u0000",
          // Things that start with `@` followed by a letter.
          "^@\\w.*\u0000",
          // Absolute imports & other imports.
          "^.*\u0000",
          // Relative imports.
          // Anything that starts with a dot.
          "^\\..*\u0000",
        ]
      ]
    }],
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',

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

    'no-continue': 'off',

    // Don't use array destructuring for assignement expressions
    'prefer-destructuring': [
      'error',
      {
        'VariableDeclarator': {
          'array': false,
          'object': true
        },
        'AssignmentExpression': {
          'array': false,
          'object': false
        }
      }
    ],

    // Tweaking @typescript-eslint
    '@typescript-eslint/member-delimiter-style': 'off', // No semi-colons in types
    '@typescript-eslint/explicit-function-return-type': 'off', // Don't force every function to have a return type
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Allow as many classes per file as necessary
    'max-classes-per-file': 'off',

    // Allow empty arrow functions
    '@typescript-eslint/no-empty-function': 'off',

    // Allow unused arguments
    '@typescript-eslint/no-unused-vars': 'off',

    // Allow use after define
    'no-use-before-define': 'off',

    'multiline-comment-style': ['error', 'starred-block'],

    'spaced-comment': ['error', 'always'],
  },
}
