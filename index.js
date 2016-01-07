/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreAsStream = (value) => {
  const ignoredValues = {}
  if (value === undefined) {
    value = ignoredValues
  }

  const stream = new BehaviorSubject(value)
  const dispatchValue = _value => {
    var valueIsDefined = _value !== undefined
    var valueIsDifferent = value !== _value
    if (valueIsDefined && valueIsDifferent) {
      value = _value
      stream.onNext(value)
    }
  }
  return {
    getStream: () => stream.filter(x => x !== ignoredValues),
    update: cb => {
      dispatchValue(typeof cb === 'function' ? cb(value) : cb, true)
    }
  }
}
