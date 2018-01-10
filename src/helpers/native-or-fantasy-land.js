'use strict';

import fl from 'fantasy-land';
const nativeOrFantasyLand = (target, method) => {
    if (typeof target[fl[method]] === 'function') {
        return fl[method];
    } else if (typeof target[method] === 'function') {
        return method;
    } else {
        throw new TypeError(`Could not find ${target}#${method} or ${target}#${fl[method]}.`);
    }
};
export default nativeOrFantasyLand;