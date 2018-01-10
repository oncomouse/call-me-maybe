'use strict'

const nativeOrFantasyLand = (target, method) => {
    if (typeof target[`fantasy-land/${method}`] === 'function') {
        return `fantasy-land/${method}`
    } else if (typeof target[method] === 'function') {
        return method
    } else {
        throw new TypeError(`Could not find ${target}#${method} or ${target}#fantasy-land/${method}.`)
    }
}
export default nativeOrFantasyLand
