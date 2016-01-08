/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreStream = (value, limit) => {
  limit = limit > 0 ? limit : 100
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
        if (UNDO_HISTORY.length > limit) {
          UNDO_HISTORY.shift()
        }
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
    undo: () => dispatchValue(UNDO_HISTORY.pop(), false),
    redo: () => dispatchValue(REDO_HISTORY.pop(), true),
    get canUndo () {
      return UNDO_HISTORY.length > 0
    },
    get canRedo () {
      return REDO_HISTORY.length > 0
    }
  }
}
