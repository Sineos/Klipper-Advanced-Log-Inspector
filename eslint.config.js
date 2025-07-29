// .eslintrc.js
module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react', 'react-hooks', 'unicorn'],
    rules: {
        indent: ['error', 4, { VariableDeclarator: 1 }],
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'max-len': ['warn', { code: 160 }],
        curly: ['error', 'multi-line'],
        'linebreak-style': ['error', 'unix'],
        'no-template-curly-in-string': 'warn',
        'capitalized-comments': 'off',
        'spaced-comment': 'off',
        'prefer-reflect': 'off',
        'no-unused-expressions': 'warn',
        'no-await-in-loop': 'warn',
        'require-atomic-updates': 'warn',
        'prefer-named-capture-group': 'warn',
        'unicorn/catch-error-name': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-string-slice': 'warn',
        'unicorn/no-nested-ternary': 'warn',
        'unicorn/prefer-number-properties': 'warn',
        'unicorn/no-fn-reference-in-iterator': 'warn',
        'unicorn/better-regex': 'warn',
        'unicorn/prefer-optional-catch-binding': 'warn',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
