const { taggedSum } = require('daggy')
const { equals } = require('sanctuary-type-classes')
const aliases = require('./helpers/fantasy-land-aliases')
const { assertType, assertFunction, assertConcat } = require('./helpers/asserts')
const nofl = require('./helpers/native-or-fantasy-land')

// Maybe
const assertMaybe = (method, value) => assertType(Maybe, method, value)

const Maybe = taggedSum('Maybe', {
    Just: ['value']
    , Nothing: []
})

Maybe.of = Maybe.Just
Maybe.empty = () => Maybe.Nothing
Maybe.zero = () => Maybe.Nothing
// equals :: Maybe f => f a -> f b -> Boolean
Maybe.prototype.equals = function(that) {
    return this.cata({
        Nothing: () => that.cata({
            Nothing: () => true
            , Just: () => false
        })
        , Just: value => that.cata({
            Nothing: () => false
            , Just: thatValue => equals(value, thatValue)
        })
    })
}
// map :: Maybe f => f a ~> (a -> b) -> f b
Maybe.prototype.map = function(transformation) {
    assertFunction('Maybe#map', transformation)
    return this.cata({
        Nothing: () => this
        , Just: value => Maybe.Just(transformation(value))
    })
}
// apply :: Maybe f => f (a -> b) ~> f a -> f b
Maybe.prototype.apply = function(that) {
    assertMaybe('Maybe#apply', that)
    return this.cata({
        Nothing: () => this
        , Just: value => that.map(value)
    })
}
// ap :: Maybe f => f a ~> f (a -> b) -> f b
Maybe.prototype.ap = function(that) {
    assertMaybe('Maybe#ap', that)
    //assertFunction(`Maybe#ap`, that.value)
    return this.cata({
        Nothing: () => this
        , Just: () => that.cata({
            Nothing: () => that
            , Just: thatValue => this.map(thatValue)
        })
    })
}
// chain :: Maybe f => f a ~> (a -> f b) -> f b
Maybe.prototype.chain = function(transformation) {
    assertFunction('Maybe#chain', transformation)
    return this.cata({
        Nothing: () => this
        , Just: transformation
    })
}
// unsafeGet :: Maybe f => f a ~> a
Maybe.prototype.unsafeGet = function() {
    return this.cata({
        Nothing: () => {throw new TypeError(`
Can't extract the value of a Nothing.

    Since Nothing holds no values, it's not possible to extract one from them.
    You might consider switching from Maybe#get to Maybe#getOrElse, or some other method
    that is not partial.
`)}
        , Just: value => value
    })
}
// getOrElse :: Maybe f => f a ~> a -> a
Maybe.prototype.getOrElse = function(defValue) {
    return this.cata({
        Nothing: () => defValue
        , Just: value => value
    })
}
// concat :: Maybe f => f a ~> f a -> f a
Maybe.prototype.concat = function(that) {
    assertMaybe('Maybe#concat', that)
    return this.cata({
        Nothing: () => that
        , Just: value => Maybe.Just(
            that.cata({
                Nothing: () => value
                , Just: thatValue => value[nofl(value, 'concat')](thatValue)
            })
        )
    })
}
// fold :: Maybe f => f a ~> (a -> f b) -> (a -> f b) -> f b
Maybe.prototype.fold = function(transformNothing, transformJust) {
    assertFunction('Maybe#fold', transformJust)
    assertFunction('Maybe#fold', transformNothing)
    return this.cata({
        Nothing: () => transformNothing()
        , Just: value => transformJust(value)
    })
}
// filter :: Maybe f => f a ~> (a -> Boolean) -> f a
Maybe.prototype.filter = function(predicate) {
    assertFunction('Maybe#filter', predicate)
    return this.cata({
        Nothing: () => this
        , Just: value => predicate(value) ? Maybe.Just(value) : Maybe.Nothing
    })
}
// alt :: Maybe f => f a ~> f a -> f a
Maybe.prototype.alt = function(that) {
    assertMaybe('Maybe#alt', that)
    return this.cata({
        Nothing: () => that
        , Just: value => Maybe.Just(value)
    })
}
// Dress ADT & member methods w/ Fantasy Land aliases:
aliases(Maybe)
aliases(Maybe.prototype)

module.exports = Maybe
