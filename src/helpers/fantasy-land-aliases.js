'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fl = require('fantasy-land');
const aliases = struct => {
    (0, _keys2.default)(struct).forEach(method => {
        if (typeof struct[method] === 'function' && Object.prototype.hasOwnProperty.call(fl, method)) {
            struct[fl[method]] = function () {
                const target = typeof this === 'object' ? this : struct;
                return target[method](...arguments);
            };
        }
    });
};
module.exports = aliases;