'use strict'

const Immutable = require('seamless-immutable')
const Rx = require('rx')
const _ = require('lodash')

class Storage {
  constructor (value) {
    this.value = Immutable(value)
    this.stream = new Rx.BehaviorSubject(this.value)
  }

  updateStore (value) {
    this.value = this.value.merge(value, {deep: true})
    this.stream.onNext(this.value)
    return this.value
  }

  updatePath (path, value) {
    return this.updateStore(_.set({}, path, value))
  }

  togglePath (path) {
    const value = Boolean(_.get(this.value, path))
    return this.updatePath(path, !value)
  }

  incrementPath (path) {
    const value = _.get(this.value, path)
    return this.updatePath(path, value + 1)
  }

  decrementPath (path) {
    const value = _.get(this.value, path)
    return this.updatePath(path, value - 1)
  }

  connect (selector) {
    const selectPaths = (path, key) => {
      return this.stream.distinctUntilChanged(x => _.get(x, path))
        .map(x => ({[key]: _.get(x, path)}))
    }
    return Rx.Observable.merge(_.map(selector, selectPaths))
  }
}

exports.Storage = Storage
