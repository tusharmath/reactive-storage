/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'
const BehaviorSubject = require('rx').BehaviorSubject

exports.create = exports.createStoreStream = (value, limit) => {
  limit = limit > 0 ? limit : 0
  const ignoredValues = {}
  if (value === undefined) {
    value = ignoredValues
  }
  var UNDO_HISTORY = []
  var REDO_HISTORY = []

  const stream = new BehaviorSubject(value)
  const dispatchValue = (_value, push) => {
    var isDefined = _value !== undefined
    var isDiff = value !== _value
    var isPushable = push === true
    var isNotIgnored = value !== ignoredValues
    var isHistoryEnabled = limit > 0

    if ([isHistoryEnabled, isDefined, !isPushable].every(Boolean)) {
      REDO_HISTORY.push(value)
    }

    if ([isHistoryEnabled, isDefined, isDiff, isPushable, isNotIgnored].every(Boolean)) {
      UNDO_HISTORY.push(value)
    }

    if ([isHistoryEnabled, isDefined, isDiff, isPushable, isNotIgnored, UNDO_HISTORY.length > limit].every(Boolean)) {
      UNDO_HISTORY.shift()
    }

    if ([isDefined, isDiff].every(Boolean)) {
      value = _value
      stream.onNext(value)
    }
  }
  const reset = () => {
    REDO_HISTORY = []
    UNDO_HISTORY = []
  }
  const _stream = stream.filter(x => x !== ignoredValues)
  return {
    stream: _stream,
    set: cb => {
      REDO_HISTORY = []
      dispatchValue(typeof cb === 'function' ? cb(value) : cb, true)
      return stream
    },
    end: () => {
      reset()
      stream.onCompleted()
    },
    get: () => value,
    undo: () => dispatchValue(UNDO_HISTORY.pop(), false),
    redo: () => dispatchValue(REDO_HISTORY.pop(), true),
    reset,
    get canUndo () {
      return UNDO_HISTORY.length > 0
    },
    get canRedo () {
      return REDO_HISTORY.length > 0
    }
  }
}
