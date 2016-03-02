# Reactive Storage
[![Build Status][travis-svg]][travis]
[![npm][npm-svg]][npm]
[![Coverage Status][coveralls-svg]][coveralls]


[travis-svg]: https://travis-ci.org/tusharmath/reactive-storage.svg?branch=master
[travis]: https://travis-ci.org/tusharmath/reactive-storage
[npm-svg]: https://img.shields.io/npm/v/reactive-storage.svg
[npm]: https://www.npmjs.com/package/reactive-storage
[coveralls]: https://coveralls.io/github/tusharmath/reactive-storage?branch=develop
[coveralls-svg]: https://coveralls.io/repos/github/tusharmath/reactive-storage/badge.svg?branch=develop


A module that does the following things —

1. Exposes an immutable object as a stream.

2. Stream notifies whenever there is a real change.

3. Keeps a history of the changes.

4. [irecord](https://github.com/ericelliott/irecord) is awesome, but only works with [immutableJS](https://github.com/facebook/immutable-js), reactive-storage on the other hand lets the developer decide the immutable library he wants to integrate with. Infact you can even use it with primitive immutables such as RegEx, String, Date, Number etc. and not depend on any external libraries at all.

### Installation

```
npm install reactive-storage --save
```

### Usage

```javascript

import {create} from 'reactive-storage'
import Immutable from 'seamless-immutable'

/*
* The first param should be an immutable object.
* Second param is the size limit to the history which is 1 by default.
*/
const store = create(new Immutable({a: 1, b: 2}), 30)

/*
* Automatically logs every change in the store.
* Change detection is done via `===` comparison between the initial and the final store values.
*/
store.stream.subscribe(x => console.log(x))


/*
* Changes to the store can be made via the `update` function which takes a `callback` as a param. The `callback` is called with the current value of the store.
*/

store.set(x => x.set('a', 100)

/*
* We can also pass direct values to the store.
* CAUTION: This approach is only good for immutables suchs as - Number, Boolean, String etc. Use a library like ImmutableJS to work with complex data structures.
*/

store.set(100)

```

## Store API

- `set(function|object)`: Used to update the given stream with a particular value. If the type of the param is `function` then it will be called with the most recent value as the first param. The return value of the function will be used as the updated value and if it is different to the one before, it will also dispatch it onto the stream.

- `get()`: Returns the current value of the store.

- `stream`: Exposes the store as a stream. Useful for [react-announce-connect](https://travis-ci.org/tusharmath/react-announce-connect)

- `undo()`: Goes back a previous state.

- `redo()`: Goes forward a previous state.

- `canUndo()`: Returns true if undo is possible.

- `canRedo()`: Returns true if redo is possible.

- `reset()`: Resets the history.

- `end()`: Ends the exposed stream and clears all history information.
