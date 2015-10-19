# Reactive Storage

As the application grows, it become difficult to debug the state of the application. Having a single source of truth simplifies the complete process. Reactive Storage, create a store that is exposed as an observable so that the dependent components are automatically notified when the state of the application changes.

```javascript
const Store = require('reactive-storage')
const store = new Store({a: 1, b: 2, c: {d: 3}}) // Initial Value for the Store


/*
*
* Connect to a path
*/

store.connect('c.d').subscribe(x => console.log(x))
store.incrementPath('c.d') // outputs 4
store.incrementPath('c.d') // outputs 5
store.decrementPath('c.d') // outputs 4
store.updatePath('c.d', 4) // outputs nothing since the value hasn't changed
store.updatePath('c.d', 5) // outputs 5
```
