# Call Me Maybe – Daggy-based, Fantasyland-compliant Maybe

![GIF of "Call Me Maybe" Video](https://media.giphy.com/media/jRfNbVMf2zqZG/giphy.gif)

This library is an implementation of the Maybe [ADT](https://en.wikipedia.org/wiki/Algebraic_data_type) based on Fantasyland's [daggy](https://github.com/fantasyland/daggy) implementation. [origamitower/folktale](https://github.com/origamitower/folktale) contains a very good implementation of the Maybe type, but it does not implement Fantasyland's [Alt](http://www.tomharding.me/2017/04/24/fantas-eel-and-specification-10/) specification. Folktale's libraries are great but they are hard to extend, so I wrote this implementation using the more extensible daggy as the base.

## Override Equality

This library uses [epoberezkin/fast-deep-equals](https://github.com/epoberezkin/fast-deep-equal) for equality checking. It is an ok (and small) implementation. Lodash, Ramda, and Sanctuary's equality methods are all around 40K, which is a lot to implement Setoid. If, however, you want to use a different library, you can add it to Maybe by re-assigning the value of `Maybe._equals`. For instance:

~~~javascript
var Maybe = require('call-me-maybe');
var {equals} = require('ramda');

Maybe._equals = equals; // Now using Ramda's equality check
~~~

## API

### Type Methods

#### `of` Method

~~~
Maybe#of :: Maybe f => a -> f a
~~~

#### `empty` Method

~~~
Maybe#empty :: Nothing
~~~

#### `zero` Method

~~~
Maybe#zero :: Nothing
~~~

### Member Methods

#### `equals` Method

~~~
equals :: Maybe f => f a ~> f b -> Boolean
~~~

#### `map` Method

~~~
map :: Maybe f => f a ~> (a -> b) -> f b
~~~

#### `apply` Method

~~~
apply :: Maybe f => f (a -> b) ~> f a -> f b
~~~

#### `ap` Method

~~~
ap :: Maybe f => f a ~> f (a -> b) -> f b
~~~

#### `chain` Method

~~~
chain :: Maybe f => f a ~> (a -> f b) -> f b
~~~

#### `unsafeGet` Method

~~~
unsafeGet :: Maybe f => f a ~> a
~~~

#### `getOrElse` Method

~~~
getOrElse :: Maybe f => f a ~> a -> a
~~~

#### `concat` Method

~~~
concat :: Maybe f => f a ~> f a -> f a
~~~

#### `fold` Method

~~~
fold :: Maybe f => f a ~> (a -> f b) -> (a -> f b) -> f b
~~~

#### `filter` Method

~~~
filter :: Maybe f => f a ~> (a -> Boolean) -> f a
~~~

#### `alt` Method

~~~
alt :: Maybe f => f a ~> f a -> f a
~~~

### Fantasy Land Interface

The following methods from the API have Fantasyland compliant equivalents:

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

~~~
equals(
    Maybe.of([6]).concat(Maybe.of[7])
    , Maybe['fantasy-land/of']([6])['fantasy-land/concat'](Maybe['fantasy-land/of']([7]))
) === true
~~~

## Fantasyland Type Implementations

This library implements the following Fantasyland specifications:

* Setoid
* Semigroup
* Monoid
* Filterable
* Functor
* Apply
* Applicative
* Alt
* Plus
* Alternative
* Chain
* Monad
