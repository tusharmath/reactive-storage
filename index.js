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
  const UNDO_HISTORY = []
  const REDO_HISTORY = []

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
    update: cb => {
      dispatchValue(typeof cb === 'function' ? cb(value) : cb, true)
      return stream
    },
    undo: () => {
      dispatchValue(UNDO_HISTORY.pop(), false)
    },
    redo: () => {
      dispatchValue(REDO_HISTORY.pop(), true)
    }
  }
}
