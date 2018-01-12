import fl from 'fantasy-land'
import laws from 'fantasy-laws'
import assert from 'fantasy-laws/src/internal/assert'
import { toString, equals } from 'ramda'
import jsc from 'jsverify'
import Maybe from '../src/maybe'
import { describe, test } from 'mocha'

const ArbPrimitive = jsc.oneof(
    jsc.bool
    , jsc.string
    , jsc.number
)
const MaybeArb = jsc.oneof(
    ArbPrimitive
    , jsc.array(ArbPrimitive)
    , jsc.record({
        key1: ArbPrimitive
        , key2: ArbPrimitive
    })
).smap(
    Maybe.Just
    , maybe => maybe.value
    , toString
)
const MaybeConcatArb = jsc.array(ArbPrimitive).smap(
    Maybe.Just
    , maybe => maybe.value
    , toString
)
const MaybeFuncArb = jsc.fn(jsc.oneof(
    ArbPrimitive
    , jsc.array(ArbPrimitive)
    , jsc.string
    , jsc.record({
        key1: ArbPrimitive
        , key2: ArbPrimitive
    })
)).smap(
    Maybe.Just
    , maybe=>maybe.value
    , toString
)
const FuncMaybeArb = jsc.fn(MaybeArb)
describe('Maybe', () => {
    describe('<Setoid Laws>', () => {
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
    describe('<Semigroup Laws>', () => {
        const { associativity } = laws.Semigroup(equals)
        test('associativity', associativity(
            MaybeConcatArb
            , MaybeConcatArb
            , MaybeConcatArb
        ))
    })
    describe('<Monoid Laws>', () => {
        const { rightIdentity, leftIdentity } = laws.Monoid(equals, Maybe)
        test('rightIdentity', rightIdentity(
            MaybeArb
        ))
        test('leftIdentity', leftIdentity(
            MaybeArb
        ))
    })
    describe('<Filterable Laws>', () => {
        const distributivity = assert.forall3((v, p, q) => equals(
            v[fl.filter](x => p(x) && q(x))
            , v[fl.filter](p)[fl.filter](q)
        ))
        const identity = assert.forall1(v => equals(
            v[fl.filter](() => true)
            , v
        ))
        const annihilation = assert.forall2((v, w) => equals(
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
    describe('<Functor Laws>', () => {
        const { identity, composition } = laws.Functor(equals)
        test('identity', identity(
            MaybeArb
        ))
        test('composition', composition(
            MaybeArb
            , jsc.fn(jsc.number)
            , jsc.fn(jsc.number)
        ))
    })
    describe('<Apply Laws>', () => {
        const { composition } = laws.Apply(equals)
        test('composition', composition(
            MaybeFuncArb
            , MaybeFuncArb
            , MaybeFuncArb
        ))
    })
    describe('<Applicative Laws>', () => {
        const {
            identity
            , homomorphism
            , interchange
        } = laws.Applicative(equals, Maybe)
        test('identity', identity(
            MaybeArb
        ))
        test('homomorphism', homomorphism(jsc.fn(jsc.number), jsc.number))
        test('interchange', interchange(
            MaybeFuncArb
            , jsc.number
        ))
    })
    describe('<Alt Laws>', () => {
        const { associativity, distributivity } = laws.Alt(equals)
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
    describe('<Plus Laws>', () => {
        const {
            rightIdentity
            , leftIdentity
            , annihilation
        } = laws.Plus(equals, Maybe)

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
    describe('<Alternative Laws>', () => {
        const { distributivity, annihilation } = laws.Alternative(equals, Maybe)
        test('distributivity', distributivity(
            MaybeArb
            , MaybeFuncArb
            , MaybeFuncArb

        ))
        test('annihilation', annihilation(
            MaybeArb
        ))
    })
    describe('<Chain Laws>', () => {
        const { associativity } = laws.Chain(equals)
        test('associativity', associativity(
            MaybeArb
            , FuncMaybeArb
            , FuncMaybeArb
        ))
    })
    describe('<Monad Laws>', () => {
        const { rightIdentity, leftIdentity } = laws.Monad(equals, Maybe)
        test('leftIdentity', leftIdentity(
            jsc.fn(jsc.number)
            , MaybeArb
        ))
        test('rightIdentity', rightIdentity(
            MaybeArb
        ))
    })
})
