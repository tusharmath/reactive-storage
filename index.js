/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'
const _ = require('lodash')
const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreStream = (value, limit) => {
  limit = limit > 0 ? limit : 1
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

    if (_.all([isDefined, !isPushable])) {
      REDO_HISTORY.push(value)
    }

    if (_.all([isDefined, isDiff, isPushable, isNotIgnored])) {
      UNDO_HISTORY.push(value)
    }

    var queueIsOversize = UNDO_HISTORY.length > limit
    if (_.all([isDefined, isDiff, isPushable, isNotIgnored, queueIsOversize])) {
      UNDO_HISTORY.shift()
    }

    if (_.all([isDefined, isDiff])) {
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
    reset: () => {
      REDO_HISTORY = []
      UNDO_HISTORY = []
    },
    get canUndo () {
      return UNDO_HISTORY.length > 0
    },
    get canRedo () {
      return REDO_HISTORY.length > 0
    }
  }
}
