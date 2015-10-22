'use strict'

import Immutable from 'seamless-immutable'
import { BehaviorSubject, Observable } from 'rx'
import _ from 'lodash'

class Storage {
  constructor(value) {
    this._value = Immutable(value)
    this._stream = new BehaviorSubject(this._value)
  }

  updateStore(value) {
    this._value = this._value.merge(value, {deep: true})
    this._stream.onNext(this._value)
    return this._value
  }

  updatePath(path, value) {
    return this.updateStore(_.set({}, path, value))
  }

  togglePath(path) {
    const value = Boolean(_.get(this._value, path))
    return this.updatePath(path, !value)
  }

  incrementPath(path) {
    const value = _.get(this._value, path)
    return this.updatePath(path, value + 1)
  }

  decrementPath(path) {
    const value = _.get(this._value, path)
    return this.updatePath(path, value - 1)
  }

  connect(selector) {
    const selectPaths = (path, key) => {
      return this._stream.distinctUntilChanged(x => _.get(x, path))
        .map(x => ({[key]: _.get(x, path)}))
    }
    var observables = _.map(selector, selectPaths)
    return observables.length > 0 ? Observable.merge(observables) : this._stream
  }
}

exports.Storage = Storage
