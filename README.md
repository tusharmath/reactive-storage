# Reactive Storage [![Build Status](https://travis-ci.org/tusharmath/reactive-storage.svg?branch=master)](https://travis-ci.org/tusharmath/reactive-storage) [![npm](https://img.shields.io/npm/v/reactive-storage.svg)](reactive-storage)

Exposes a simple function to create a stream from any immutable data store. The stream emits a value only if there is a change.

### Installation

```
npm install reactive-storage --save
```

### Usage

```javascript

import {createStoreAsStream} from 'reactive-storage'
import Immutable from 'seamless-immutable'

const store = createStoreAsStream(new Immutable({a: 1, b: 2}))

/*
* Automatically logs every change in the store.
* Change detection is done via `===` comparison between the initial and the final store values.
*/
store.getStream().subscribe(x => console.log(x))


/*
* Changes to the store can be made via the `update` function which takes a `callback` as a param. The `callback` is called with the current value of the store. 
*/

store.update(x => x.set('a', 100)

/*
* We can also pass direct values to the store.
* CAUTION: This approach is only good for immutables suchs as - Number, Boolean, String etc. Use a library like ImmutableJS to work with complex data structures.
*/

store.update(100)

```

## API

- `set(function|object)`: Used to update the given stream with a particular value. If the type of the param is `function` then it will be called with the most recent value as the first param. The return value of the function will be used as the updated value and if it is different to the one before, it will also dispatch it onto the stream.
- `get()`: Returns the current value of the store.
- `getStream()`: Exposes the store as a stream. Useful for 
[react-announce-connect](https://travis-ci.org/tusharmath/react-announce-connect)
