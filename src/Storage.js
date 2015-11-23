'use strict'

import {BehaviorSubject, Observable} from 'rx'
import {map, keys, transform, partial} from 'lodash'

export class Storage {
  constructor (params) {
    var {value} = params
    const stream = new BehaviorSubject(value)
    const toKeyValue = (keys, ...items) => {
      return transform(keys, (obj, k, i) => obj[k] = items[i], {})
    }
    this.updateStore = cb => {
      value = typeof cb === 'function' ? cb(value) : cb
      stream.onNext(value)
      return value
    }
    this.connect = selector => {
      const selectPaths = (path, key) => {
        return stream
          .map(x => params.get(x, path))
          .filter(x => x !== undefined)
          .distinctUntilChanged()
      }
      const observables = map(selector, selectPaths)
      return observables.length > 0 ? Observable.combineLatest(observables, partial(toKeyValue, keys(selector))) : stream
    }
  }
}
