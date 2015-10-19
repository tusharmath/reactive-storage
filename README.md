# Reactive Storage [![Build Status](https://travis-ci.org/tusharmath/reactive-storage.svg?branch=master)](https://travis-ci.org/tusharmath/reactive-storage)

As the application grows, it become difficult to debug the state of the application. Having a single source of truth simplifies the complete process. Reactive Storage, create a store that is exposed as an observable so that the dependent components are automatically notified when the state of the application changes.

Using Immutable for a store makes a lot more sense because it make the change detection algorithm extermely fast and makes sure that the dependants are notified only when the values have actually changed.

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

`updatePath(path, value)` : updates the value on the path provided for the store

`togglePath(path)` : toggles the value (true|false).

`incrementPath(path)` & `decrementPath(path)` : increases and decreases the value by 1.
