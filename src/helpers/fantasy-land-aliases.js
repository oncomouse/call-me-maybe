const fl = require('fantasy-land')
const aliases = struct => {
    Object.keys(struct).forEach(method => {
        if(
            typeof struct[method] === 'function'
            && Object.prototype.hasOwnProperty.call(fl, method)
        ) {
            struct[fl[method]] = function() {
                const target = typeof this === 'object' ? this : struct
                return target[method](...arguments)
            }
        }
    })
}
module.exports = aliases
