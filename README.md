# Reactive Storage [![Build Status](https://travis-ci.org/tusharmath/reactive-storage.svg?branch=master)](https://travis-ci.org/tusharmath/reactive-storage)

The project is heavily inspired by [redux](rackt.github.io/redux/) and flows the same design philosophy —

> The whole state of your app is stored in an object tree inside a single store.
The only way to change the state tree is to emit an action, an object describing what happened.
To specify how the actions transform the state tree, you write pure reducers.

Reactive Storage is an opinionated version of redux.
1. There are no reducers, instead store manipulations are optimized via [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) this makes the change detection algorithm extremely fast.
2. The store implements a version of [connect](https://github.com/rackt/redux/issues/419) by exposing it as an observable. You can attach an observer to various parts of the store and listen to real changes.

### API
### constructor
Create a new storage and pass initial state to the constructor.

```javascript
var Storage = require('reactive-storage')
var store = new Storage({a: 'b'})
```



### connect
Creates a connection to the store, returns an observable. Takes only one param, to specify the paths in the store you would want to subscribe to and the alias to be used when the event is fired.

When no params are passed it listens to the global store and emits whenever anything changes anywhere inside the store.


```javascript
var observable = connect({
  a: 'path.to.an.object.inside.the.store', // changes fired on this path are available on `a` property
  b: '...'
})

observable.subscribe(x => console.log('value in a', x.a))
observable.subscribe(x => console.log('value in b', x.b))

```

### updateStore
Merges properties individually with the store, performing a deep check to make sure that the event is emitted only if the values have actually changed.

```javascript

store.updateStore({a: 'b'}) // will not emit anything since the initial and final values are the same
store.updateStore({a: 'a'}) // emits an event to all the subscribers listening to this path
```

Theere are other utility functions such as —

- `updatePath(path, value)` : updates the value on the path provided for the store

- `togglePath(path)` : toggles the value (true|false).

- `incrementPath(path, delta)` & `decrementPath(path, delta)` : increases and decreases the value by `delta`. Default value is `1`
 
