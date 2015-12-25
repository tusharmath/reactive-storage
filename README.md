# Reactive Storage

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

```
