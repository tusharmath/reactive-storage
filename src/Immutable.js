/**
 * Created by tushar.mathur on 19/10/15.
 */

'use strict'
const Immutable = require('immutable')
const _ = require('lodash')

const isIterable = x => x instanceof Immutable.Iterable
const getIterableType = (frozen) => _.find(['Map', 'List'], v => frozen instanceof Immutable[v])
const createProxyObject = (frozen) => {
  switch (getIterableType(frozen)) {
    case 'Map':
      return {}
    case 'List':
      return []
  }
}
function toJS (frozen) {
  if (!isIterable(frozen)) {
    return frozen
  }
  var js = createProxyObject(frozen)
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
