/**
 * Created by tushar.mathur on 19/10/15.
 */

'use strict'
const Immutable = require('immutable')

function toJS (frozen) {
  if (frozen instanceof Immutable.Map === false && frozen instanceof Immutable.List === false) {
    return frozen
  }

  var js = {}
  if (frozen instanceof Immutable.List) {
    js = []
  }
  const keys = frozen.keys()
  for (let i of keys) {
    Object.defineProperty(js, i, {
      enumerable: true,
      get: () => toJS(frozen.get(i))
    })
  }
  return js
}

function createImmutable (obj) {
  return Immutable.fromJS(obj)
}

module.exports = {
  createImmutable, toJS
}
