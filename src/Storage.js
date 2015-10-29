'use strict'

import SeamlessImmutable from 'seamless-immutable'
import {BehaviorSubject, Observable} from 'rx'
import {get, set, map, keys, transform, partial} from 'lodash'

const createImmutable = (value) => SeamlessImmutable(value)
const toKeyValue = (keys, ...items) => {
  return transform(keys, (obj, k, i) => obj[k] = items[i], {})
}

export class Storage {
  constructor (value) {
    this._value = createImmutable(value)
    this._stream = new BehaviorSubject(this._value)
  }

  updateStore (value, deep = true) {
    this._value = this._value.merge(value, {deep})
    this._stream.onNext(this._value)
    return this._value
  }
  updatePath (path, value) {
    return this.updateStore(set({}, path, value))
  }

  togglePath (path) {
    const value = Boolean(get(this._value, path))
    return this.updatePath(path, !value)
  }

  incrementPath (path) {
    const value = get(this._value, path)
    return this.updatePath(path, value + 1)
  }

  decrementPath (path) {
    const value = get(this._value, path)
    return this.updatePath(path, value - 1)
  }

  connect (selector) {
    const selectPaths = (path, key) => {
      return this._stream
        .distinctUntilChanged(x => get(x, path))
        .filter(x => undefined !== get(x, path))
        .map(x => get(x, path))
    }
    var observables = map(selector, selectPaths)
    return observables.length > 0 ? Observable.combineLatest(observables, partial(toKeyValue, keys(selector))) : this._stream
  }
}
