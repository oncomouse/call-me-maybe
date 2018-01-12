![Travis Build Status](https://api.travis-ci.org/oncomouse/call-me-maybe.svg?branch=master)

# Call Me Maybe – Daggy-based, Fantasy Land-compliant Maybe

![GIF of "Call Me Maybe" Video](https://media.giphy.com/media/jRfNbVMf2zqZG/giphy.gif)

This library is an implementation of the [Maybe])(https://en.wikibooks.org/wiki/Haskell/Understanding_monads/Maybe) [ADT](https://en.wikipedia.org/wiki/Algebraic_data_type) based on Fantasy Land's [daggy](https://github.com/fantasyland/daggy) implementation.

[Folktale](https://github.com/origamitower/folktale) contains a very good implementation of the Maybe type, but it does not implement Fantasy Land's [Alt](http://www.tomharding.me/2017/04/24/fantas-eel-and-specification-10/) specification. Additionally, Folktale's Maybe type is not easily extended, so I wrote this one, using [daggy](https://github.com/fantasyland/daggy), which uses plain objects to build ADTs and is therefore very extensible.

## Installing

To install, run:

~~~bash
npm install @oncomouse/call-me-maybe
~~~


Or

~~~bash
yarn add @oncomouse/call-me-maybe
~~~

You can now run `require('@oncomouse/call-me-maybe')` to access the library.

## Using on Web Pages

You can also include the library in web pages using [unpkg](https://unpkg.com):

~~~html
<script src="https://unpkg.com/@oncomouse/call-me-maybe/dist/call-me-maybe.min.js"></script>
~~~

This file includes the full environment needed to use the Maybe type in your projects.

## Override Equality

This library uses [epoberezkin/fast-deep-equals](https://github.com/epoberezkin/fast-deep-equal) for equality checking. It is an ok (and small) implementation. Lodash, Ramda, and Sanctuary's equality methods are all around 40K, which is a lot to implement Setoid. If, however, you want to use a different library, you can add it to Maybe by re-assigning the value of `Maybe._equals`. For instance:

~~~javascript
var Maybe = require('@oncomouse/call-me-maybe');
var {equals} = require('ramda');

Maybe._equals = equals; // Now using Ramda's equality check
~~~

## API

Take a look at [this explanation from Fantasy Land](https://github.com/fantasyland/fantasy-land#type-signature-notation) for information on reading the function type signatures below.

### Type Methods

The following methods are applied to the Typeclass itself:

~~~javascript
Maybe.of(5) // Maybe.Just(5)
Maybe.empty() // Maybe.Nothing
Maybe.zero() // Maybe.Nothing
~~~

#### `of` Method

Return a `Maybe.Just` instance containing the supplied data.

~~~haskell
of :: Maybe f => a -> f a
~~~

#### `empty` Method

Return the empty (`Maybe.Nothing`) version of this type.

~~~haskell
empty :: Nothing
~~~

#### `zero` Method

Return the zero (`Maybe.Nothing`) version of this type.

~~~haskell
zero :: Nothing
~~~

### Member Methods

The following methods are available to members of the type:

~~~javascript
var a = Maybe.Just(7)
var b = Maybe.Just(6)

a.equals(b) // === false
a.map(x => x + 2) // Maybe.Just(9)
~~~

#### `equals` Method

Compare the equality of one `Maybe` with another.

~~~haskell
equals :: Maybe f => f a ~> f b -> Boolean
~~~

#### `map` Method

Apply a transformation function to a `Maybe`.

The transformation function does *not* itself return a `Maybe`.

~~~haskell
map :: Maybe f => f a ~> (a -> b) -> f b
~~~

#### `apply` Method

Called on a `Maybe` that contains a function with a `Maybe` that contains a value, return the `Maybe` that holds the result of the function applied to the value.

~~~haskell
apply :: Maybe f => f (a -> b) ~> f a -> f b
~~~

#### `ap` Method

Called on a `Maybe` that contains a value with a `Maybe` that contains a function, return the `Maybe` that holds the result of the function applied to the value.

~~~haskell
ap :: Maybe f => f a ~> f (a -> b) -> f b
~~~

#### `chain` Method

Called on a `Maybe` that contains a value with a function that takes a value and returns a `Maybe`, return the result of that function.

~~~haskell
chain :: Maybe f => f a ~> (a -> f b) -> f b
~~~

#### `unsafeGet` Method

Get the value of a `Maybe` but will throw an error if called on `Maybe.Nothing`.

~~~haskell
unsafeGet :: Maybe f => f a ~> a
~~~

#### `getOrElse` Method

Called on a `Maybe` that contains a value with another value, return the value of the `Maybe` or the default value if the `Maybe` is `Maybe.Nothing`.

~~~haskell
getOrElse :: Maybe f => f a ~> a -> a
~~~

#### `concat` Method

Called on a `Maybe` whose value has a `concat()` or a `fantasy-land/concat()` method with another maybe containing the same kind of value, return a Maybe containing the result of concatenating the second value to the first.

~~~haskell
concat :: Maybe f => f a ~> f a -> f a
~~~

#### `fold` Method

Called on a `Maybe` with two functions, return the result of the first if the `Maybe` is `Maybe.Nothing` and a `Maybe` with the result of the second function applied to the value of the `Maybe`.

~~~haskell
fold :: Maybe f => f a ~> (_ -> f b) -> (a -> f b) -> f b
~~~

#### `filter` Method

Called on a `Maybe` and function that takes a value and returns a Boolean, either return the `Maybe` or `Maybe.Nothing` if the Boolean is `false`.

~~~haskell
filter :: Maybe f => f a ~> (a -> Boolean) -> f a
~~~

#### `alt` Method

Called on a `Maybe` with another `Maybe`, return the first `Maybe` unless the first is `Maybe.Nothing`, in which case return the second `Maybe`.

~~~haskell
alt :: Maybe f => f a ~> f a -> f a
~~~

### Fantasy Land Interface

The following methods from the API have Fantasy Land compliant equivalents:

* `of` -> `fantasy-land/of`
* `empty` -> `fantasy-land/empty`
* `zero` -> `fantasy-land/zero`
* `equals` -> `fantasy-land/equals`
* `map` -> `fantasy-land/map`
* `ap` -> `fantasy-land/ap`
* `chain` -> `fantasy-land/chain`
* `concat` -> `fantasy-land/concat`
* `filter` -> `fantasy-land/filter`
* `alt` -> `fantasy-land/alt`

So, for instance:

~~~javascript
equals(
    Maybe.of([6]).concat(Maybe.of[7])
    , Maybe['fantasy-land/of']([6])['fantasy-land/concat'](Maybe['fantasy-land/of']([7]))
) === true
~~~

## Fantasy Land Type Implementations

This library implements the following Fantasy Land specifications:

* [Setoid](https://github.com/fantasyland/fantasy-land#setoid)
* [Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)
* [Monoid](https://github.com/fantasyland/fantasy-land#monoid)
* [Filterable](https://github.com/fantasyland/fantasy-land#filterable)
* [Functor](https://github.com/fantasyland/fantasy-land#monoid)
* [Apply](https://github.com/fantasyland/fantasy-land#monoid)
* [Applicative](https://github.com/fantasyland/fantasy-land#applicative)
* [Alt](https://github.com/fantasyland/fantasy-land#alt)
* [Plus](https://github.com/fantasyland/fantasy-land#plus)
* [Alternative](https://github.com/fantasyland/fantasy-land#alternative)
* [Chain](https://github.com/fantasyland/fantasy-land#chain)
* [Monad](https://github.com/fantasyland/fantasy-land#monad)
