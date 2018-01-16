export const assertFunction = (method, transformation) => {
    if (typeof transformation !== 'function') {
        throw new TypeError(`${method} expects a function, but was given ${transformation}.`)
    }
}
export const assertType = (T, method, value) => {
    if (!T.is(value)) {
        console.warn(`${T}.${method} expects a value of type ${T}, but was given ${value}.`)
    }
}
export const assertConcat = (method, target) => {
    if(
        typeof target === 'undefined'
        && typeof target.value['concat'] !== 'function'
        && typeof target.value['fantasy-land/concat'] !== 'function'
    ) {
        throw new TypeError(`${method} expects a value that can be concated to, but was given ${target.value}.`)
    }
}
/*const determineTest = (type) => {
    switch(typeof type) {
    case 'object':
        if(type instanceof Array) {
            return x =>
                type
                    .map(t => determineTest(t))
                    .reduce((a, b) => a && b(x), true)
        } else {
            return () => true
        }
    case 'function':
        if(Object.prototype.hasOwnProperty.call(type, 'is')) {
            return x => !type.is(x)
        } else {
            return x => !(x instanceof type)
        }
    case 'string':
        return x => typeof x !== type
    default:
        return () => true
    }
}
export const assertContains = (T, method, type, adt) => {
    if (T.is(adt) && determineTest(type)(adt.value)) {
        console.warn(`${method} expects a ${T} containing a value of type ${type} but received ${adt.value}`)
    }
}*/
