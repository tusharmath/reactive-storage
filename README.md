# Reactive Storage

As the application grows, it become difficult to debug the state of the application. Having a single source of truth simplifies the complete process. Reactive Storage, create a store that is exposed as an observable so that the dependent components are automatically notified when the state of the application changes.

### API
`constructor()`
Create a new storage and pass initial state to the constructor.

```javascript
var Storage = require('reactive-storage')
var store = new Storage({a: 'b'})
```



`connect()` Creates a connection to the store, returns an observable

```javascript
var observable = connect({
  a: 'path.to.an.object.inside.the.store',
  b: '...'
})

observable.subscribe(x => console.log('value in a', x.a))
observable.subscribe(x => console.log('value in b', x.b))

```

