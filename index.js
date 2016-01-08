/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreStream = (value) => {
  const ignoredValues = {}
  if (value === undefined) {
    value = ignoredValues
  }
  var UNDO_HISTORY = []
  var REDO_HISTORY = []

  const stream = new BehaviorSubject(value)
  const dispatchValue = (_value, push) => {
    var valueIsDefined = _value !== undefined
    var valueIsDifferent = value !== _value
    var pushIsTrue = push === true

    if (valueIsDefined && push === false) {
      REDO_HISTORY.push(value)
    }

    if (valueIsDefined && valueIsDifferent) {
      if (pushIsTrue && value !== ignoredValues) {
        UNDO_HISTORY.push(value)
      }
      value = _value
      stream.onNext(value)
    }
  }
  return {
    getStream: () => stream.filter(x => x !== ignoredValues),
    set: cb => {
      REDO_HISTORY = []
      dispatchValue(typeof cb === 'function' ? cb(value) : cb, true)
      return stream
    },
    get: () => value,
    undo: () => {
      dispatchValue(UNDO_HISTORY.pop(), false)
    },
    redo: () => {
      dispatchValue(REDO_HISTORY.pop(), true)
    }
  }
}
