// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        'indent': ['error', 4, {'SwitchCase': 1}],
        'semi': ['error', 'always'],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'space-before-function-paren': 0,
        'no-useless-escape': 0,
        'no-new': 0,
        'eol-last': 0,
        'new-cap': ['error', {'newIsCap': false}]
    }
}
