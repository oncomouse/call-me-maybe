const nativeOrFantasyLand = require('./native-or-fantasy-land')
const assertFunction = (method, transformation) => {
    if (typeof transformation !== 'function') {
        throw new TypeError(`${method} expects a function, but was given ${transformation}.`)
    }
}
const assertType = (T, method, value) => {
    if(!T.is(value)) {
        console.warn(`${T}.${method} expects a value of the same type, but was given ${value}.`)
    }
}
const assertConcat = (method, target) => {
    try {
        nativeOrFantasyLand(target.value, 'concat')
    } catch(e) {
        throw new TypeError(`${method} expects a value that can be concated too, but was given ${target.value}.`)
    }
}

module.exports = {
    assertFunction
    , assertType
    , assertConcat
}
