'use strict'

import { taggedSum } from 'daggy'
import equals from './helpers/equals'
import {
    assertType
    , assertConcat
    , assertFunction
    , assertContains
} from './helpers/asserts'
import nofl from './helpers/native-or-fantasy-land'

// Maybe
const assertMaybe = (method, value) => assertType(Maybe, method, value)
const assertMaybeContains = (method, type, maybe) => assertContains(Maybe, method, type, maybe)

const Maybe = taggedSum('Maybe', {
    Just: ['value']
    , Nothing: []
})

Maybe.of = Maybe.Just
Maybe.empty = () => Maybe.Nothing
Maybe.zero = () => Maybe.Nothing
Maybe._equals = equals
// equals :: Maybe f => f a -> f b -> Boolean
Maybe.prototype.equals = function (that) {
    assertMaybe('Maybe#equals', that)
    return this.cata({
        Nothing: () => that.cata({
            Nothing: () => true
            , Just: () => false
        })
        , Just: value => that.cata({
            Nothing: () => false
            , Just: thatValue => Maybe._equals(value, thatValue)
        })
    })
}
// map :: Maybe f => f a ~> (a -> b) -> f b
Maybe.prototype.map = function (transformation) {
    assertFunction('Maybe#map', transformation)
    return this.cata({
        Nothing: () => this
        , Just: value => Maybe.Just(transformation(value))
    })
}
// apply :: Maybe f => f (a -> b) ~> f a -> f b
Maybe.prototype.apply = function (that) {
    assertMaybe('Maybe#apply', that)
    assertMaybeContains('Maybe#apply', 'function', this)
    return this.cata({
        Nothing: () => this
        , Just: value => {
            assertFunction('Maybe#apply', value)
            return that.map(value)
        }
    })
}
// ap :: Maybe f => f a ~> f (a -> b) -> f b
Maybe.prototype.ap = function (that) {
    assertMaybe('Maybe#ap', that)
    assertMaybeContains('Maybe#ap', 'function', that)
    return this.cata({
        Nothing: () => this
        , Just: () => that.cata({
            Nothing: () => that
            , Just: thatValue => {
                assertFunction('Maybe#ap', thatValue)
                return this.map(thatValue)
            }
        })
    })
}
// chain :: Maybe f => f a ~> (a -> f b) -> f b
Maybe.prototype.chain = function (transformation) {
    assertFunction('Maybe#chain', transformation)
    return this.cata({
        Nothing: () => this
        , Just: transformation
    })
}
// unsafeGet :: Maybe f => f a ~> a
Maybe.prototype.unsafeGet = function () {
    return this.cata({
        Nothing: () => {
            throw new TypeError(`
Can't extract the value of Maybe.Nothing.

    You called unsafeGet on Maybe.Nothing, which has no value. This is not possible (hence
    this error). You may wish to use Maybe#getOrElse in place of this method, to handle this
    condition, should it occur, in the future.
`)
        }
        , Just: value => value
    })
}
// getOrElse :: Maybe f => f a ~> a -> a
Maybe.prototype.getOrElse = function (defValue) {
    return this.cata({
        Nothing: () => defValue
        , Just: value => value
    })
}
// concat :: Maybe f => f a ~> f a -> f a
Maybe.prototype.concat = function (that) {
    assertMaybe('Maybe#concat', that)
    assertConcat('Maybe#concat', this)
    //assertConcat('Maybe#concat', that)
    return this.cata({
        Nothing: () => that
        , Just: value => Maybe.Just(that.cata({
            Nothing: () => value
            , Just: thatValue => value[nofl(value, 'concat')](thatValue)
        }))
    })
}
// fold :: Maybe f => f a ~> (a -> f b) -> (a -> f b) -> f b
Maybe.prototype.fold = function (transformNothing, transformJust) {
    assertFunction('Maybe#fold', transformJust)
    assertFunction('Maybe#fold', transformNothing)
    return this.cata({
        Nothing: () => transformNothing()
        , Just: value => transformJust(value)
    })
}
// filter :: Maybe f => f a ~> (a -> Boolean) -> f a
Maybe.prototype.filter = function (predicate) {
    assertFunction('Maybe#filter', predicate)
    return this.cata({
        Nothing: () => this
        , Just: value => predicate(value) ? Maybe.Just(value) : Maybe.Nothing
    })
}
// alt :: Maybe f => f a ~> f a -> f a
Maybe.prototype.alt = function (that) {
    assertMaybe('Maybe#alt', that)
    return this.cata({
        Nothing: () => that
        , Just: value => Maybe.Just(value)
    })
}
// Dress ADT & member methods w/ Fantasy Land aliases:
Maybe['fantasy-land/of'] = Maybe['of']
Maybe['fantasy-land/empty'] = Maybe['empty']
Maybe['fantasy-land/zero'] = Maybe['zero']
Maybe.prototype['fantasy-land/equals'] = Maybe.prototype['equals']
Maybe.prototype['fantasy-land/map'] = Maybe.prototype['map']
Maybe.prototype['fantasy-land/ap'] = Maybe.prototype['ap']
Maybe.prototype['fantasy-land/chain'] = Maybe.prototype['chain']
Maybe.prototype['fantasy-land/concat'] = Maybe.prototype['concat']
Maybe.prototype['fantasy-land/filter'] = Maybe.prototype['filter']
Maybe.prototype['fantasy-land/alt'] = Maybe.prototype['alt']
export default Maybe
