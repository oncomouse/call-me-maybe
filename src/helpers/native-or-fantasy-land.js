'use strict'

const nativeOrFantasyLand = (target, method) => {
    if(target == null) {
        // Do nothing for now (throw error below)
    } else if (typeof target[`fantasy-land/${method}`] === 'function') {
        return `fantasy-land/${method}`
    } else if (typeof target[method] === 'function') {
        return method
    }
    throw new TypeError(`Could not find ${target}#${method} or ${target}#fantasy-land/${method}.`)
}
export default nativeOrFantasyLand
