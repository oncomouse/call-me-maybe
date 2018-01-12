const LINE_LENGTH = 100
const OFF = 0
const WARNING = 1
const ERROR = 2

module.exports = {
    'env': {
        'browser': true
        , 'commonjs': true
        , 'es6': true
        , 'mocha': true
    }
    , 'extends': 'eslint:recommended'
    , 'globals': {
        'process': false
        , 'APP_TITLE': false
    }
    , 'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
            , 'experimentalObjectRestSpread': true
        }
        , 'sourceType': 'module'
    }
    , 'parser': 'babel-eslint'
    , 'rules': {
        'array-callback-return': ERROR
        , 'camelcase': ERROR
        , 'comma-dangle': [
            ERROR
            , 'never'
        ]
        , 'comma-spacing': [
            ERROR
            , {
                'before': false
                , 'after': true
            }
        ]
        // I prefer commas at the start of lists; disable to turn off:
        , 'comma-style': [
            ERROR
            , 'first'
            , {
                'exceptions': {
                    'ArrayExpression': false
                    , 'ArrayPattern': false
                    , 'ArrowFunctionExpression': false
                    , 'CallExpression': false
                    , 'FunctionDeclaration': false
                    , 'FunctionExpression': false
                    , 'ImportDeclaration': false
                    , 'ObjectExpression': false
                    , 'ObjectPattern': false
                    , 'VariableDeclaration': false
                }
            }
        ]
        , 'eol-last': [
            ERROR
            , 'always'
        ]
        , 'generator-star-spacing': [
            ERROR
            , 'after'
        ]
        , 'indent': [
            ERROR
            , 4
        ]
        , 'jsx-quotes': [
            ERROR
            , 'prefer-double'
        ]
        , 'linebreak-style': [
            ERROR
            , 'unix'
        ]
        // Enforce a max line-length of 80 chars:
        , 'max-len': [
            ERROR
            , {
                'code': LINE_LENGTH
                , 'ignoreComments': true
                , 'ignoreTrailingComments': true
                , 'ignoreUrls': true
                , 'ignoreTemplateLiterals': true
            }
        ]
        , 'no-array-constructor': ERROR
        , 'no-console': [ERROR
            , {
                allow: ['warn']
            }
        ]
        , 'no-extra-bind': ERROR
        , 'no-extra-parens': [
            ERROR
            , 'all'
            , {
                'conditionalAssign': false
                , 'ignoreJSX': 'all'
                , 'nestedBinaryExpressions': false
                , 'returnAssign': false
            }
        ]
        , 'no-implicit-coercion': ERROR
        , 'no-implicit-globals': ERROR
        , 'no-magic-numbers': [
            ERROR
            , {
                'ignore': [0, 1]
                , 'ignoreArrayIndexes': true
            }
        ]
        , 'no-prototype-builtins': ERROR
        , 'no-template-curly-in-string': ERROR
        , 'no-trailing-spaces': ERROR
        , 'object-curly-spacing': [
            ERROR
            , 'always'
        ]
        , 'prefer-const': ERROR
        , 'prefer-spread': ERROR
        , 'quotes': [
            ERROR
            , 'single'
        ]
        , 'rest-spread-spacing': [
            ERROR
            , 'never'
        ]
        , 'semi': [
            ERROR
            , 'never'
        ]
    }
}