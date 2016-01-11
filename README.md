# Reactive Storage 
[![Build Status](https://travis-ci.org/tusharmath/reactive-storage.svg?branch=master)](https://travis-ci.org/tusharmath/reactive-storage)
[![npm](https://img.shields.io/npm/v/reactive-storage.svg)](https://www.npmjs.com/package/reactive-storage)


A module that does the following things —

1. Exposes an immutable object as a stream.

2. Stream notifies whenever there is a real change.

3. Keeps a history of the changes.

### Installation

```
npm install reactive-storage --save
```

### Usage

```javascript

import {createStoreStream} from 'reactive-storage'
import Immutable from 'seamless-immutable'

/*
* The first param should be an immutable object.
* Second param is the size limit to the history which is 1 by default.
*/
const store = createStoreStream(new Immutable({a: 1, b: 2}), 30)

/*
* Automatically logs every change in the store.
* Change detection is done via `===` comparison between the initial and the final store values.
*/
store.getStream().subscribe(x => console.log(x))


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

- `getStream()`: Exposes the store as a stream. Useful for [react-announce-connect](https://travis-ci.org/tusharmath/react-announce-connect) 

- `undo()`: Goes back a previous state.

- `redo()`: Goes forward a previous state.

- `canUndo()`: Returns true if undo is possible.

- `canRedo()`: Returns true if redo is possible.
