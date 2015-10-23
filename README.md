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
 

## Example
Though this module is not specific to [React](facebook.github.io/react/) here is an example of how you can use it in react.

```javascript

import {Storage} from 'reactive-storage'
import {Component} from 'react'
import moment from 'moment'
 
// Set Initial values for the store
const store = new Storage({start: Date.now(), end: Date.now()})

// Mutate the store every 800 milliseconds
setInterval(x=> store.updatePath('end', Date.now()), 800)

// Create a react component
class Time extends Component {

  // Start Listening to the store as soon as it mounts
  componentWillMount () {
    this.disposable = store
      // Listen to start and end properties
      .connect({start: 'start', end: 'end'})
      
      // Add logic to calculate duration
      .map(x => x.end - x.start)
      
      // Set the duration value into the state, for the component to re-render
      .subscribe(duration => this.setState({duration}))
  }
  
  // Stop Listening, else setState will be called though the component doesn't exist
  componentWillUnmount () {
    this.disposable.dispose()
  }

  render () {
    // Humanize & render the duration value recieved in the state
    const duration = moment.duration(this.state.duration).humanize()
    return (
      <div>
        {duration}
      <div>
    )
  }
}

```

