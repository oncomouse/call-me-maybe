const fl = require('fantasy-land')
const laws = require('fantasy-laws')
const assert = require('fantasy-laws/src/internal/assert')
const Z = require('sanctuary-type-classes')
const jsc = require('jsverify')
const Maybe = require('../')
const { suite, test } = require('mocha')

const MaybeArb = jsc.number.smap(Maybe.Just, maybe => maybe.value, Z.toString)
const MaybeConcatArb = jsc.string.smap(
    Maybe.Just
    , maybe => maybe.value
    , Z.toString
)
const MaybeFuncArb = jsc.fn(jsc.number).smap(
    Maybe.Just
    , maybe=>maybe.value
    , Z.toString
)
const FuncMaybeArb = jsc.fn(MaybeArb)
suite('Maybe#<Setoid Laws>', () => {
    const { reflexivity, symmetry, transitivity } = laws.Setoid
    test('reflexivity', reflexivity(
        MaybeArb
    ))
    test('symmetry', symmetry(
        MaybeArb
        , MaybeArb
    ))
    test('transitivity', transitivity(
        MaybeArb
        , MaybeArb
        , MaybeArb
    ))
})
suite('Maybe#<Semigroup Laws>', () => {
    const { associativity } = laws.Semigroup(Z.equals)
    test('associativity', associativity(
        MaybeConcatArb, MaybeConcatArb, MaybeConcatArb
    ))
})
suite('Maybe#<Monoid Laws>', () => {
    const { rightIdentity, leftIdentity } = laws.Monoid(Z.equals, Maybe)
    test('rightIdentity', rightIdentity(
        MaybeArb
    ))
    test('leftIdentity', leftIdentity(
        MaybeArb
    ))
})
suite('Maybe#<Filterable Laws>', () => {
    const distributivity = assert.forall3((v, p, q) => Z.equals(
        v[fl.filter](x => p(x) && q(x))
        , v[fl.filter](p)[fl.filter](q)
    ))
    const identity = assert.forall1(v => Z.equals(
        v[fl.filter](() => true)
        , v
    ))
    const annihilation = assert.forall2((v, w) => Z.equals(
        v[fl.filter](() => false)
        , w[fl.filter](() => false)
    ))
    test('distributivity', distributivity(
        MaybeArb
        , jsc.fn(jsc.bool)
        , jsc.fn(jsc.bool)
    ))
    test('identity', identity(
        MaybeArb
    ))
    test('annihilation', annihilation(
        MaybeArb
        , MaybeArb
    ))
})
suite('Maybe#<Functor Laws>', () => {
    const { identity, composition } = laws.Functor(Z.equals)
    test('identity', identity(
        MaybeArb
    ))
    test('composition', composition(
        MaybeArb
        , jsc.fn(jsc.number)
        , jsc.fn(jsc.number)
    ))
})
suite('Maybe#<Apply Laws>', () => {
    const { composition } = laws.Apply(Z.equals)
    test('composition', composition(
        MaybeFuncArb
        , MaybeFuncArb
        , MaybeFuncArb
    ))
})
suite('Maybe#<Applicative Laws>', () => {
    const {
        identity
        , homomorphism
        , interchange
    } = laws.Applicative(Z.equals, Maybe)
    test('identity', identity(
        MaybeArb
    ))
    test('homomorphism', homomorphism(jsc.fn(jsc.number), jsc.number))
    test('interchange', interchange(
        MaybeFuncArb
        , jsc.number
    ))
})
suite('Maybe#<Alt Laws>', () => {
    const { associativity, distributivity } = laws.Alt(Z.equals)
    test('associativity', associativity(

        MaybeArb
        , MaybeArb
        , MaybeArb

    ))
    test('distributivity', distributivity(
        MaybeArb
        , MaybeArb
        , jsc.fn(jsc.number)
    ))
})
suite('Maybe#<Plus Laws>', () => {
    const {
        rightIdentity
        , leftIdentity
        , annihilation
    } = laws.Plus(Z.equals, Maybe)

    test('rightIdentity', rightIdentity(
        MaybeArb
    ))
    test('leftIdentity', leftIdentity(
        MaybeArb
    ))
    test('annihilation', annihilation(jsc.fn(
        jsc.number
    )))
})
suite('Maybe#<Alternative Laws>', () => {
    const { distributivity, annihilation } = laws.Alternative(Z.equals, Maybe)
    test('distributivity', distributivity(
        MaybeArb
        , MaybeFuncArb
        , MaybeFuncArb

    ))
    test('annihilation', annihilation(
        MaybeArb
    ))
})
suite('Maybe#<Chain Laws>', () => {
    const { associativity } = laws.Chain(Z.equals)
    test('associativity', associativity(
        MaybeArb
        , FuncMaybeArb
        , FuncMaybeArb
    ))
})
suite('Maybe#<Monad Laws>', () => {
    const { rightIdentity, leftIdentity } = laws.Monad(Z.equals, Maybe)
    test('leftIdentity', leftIdentity(
        jsc.fn(jsc.number)
        , MaybeArb
    ))
    test('rightIdentity', rightIdentity(
        MaybeArb
    ))
})
