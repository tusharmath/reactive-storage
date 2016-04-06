/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject
const histable = require('histable')

exports.create = exports.createStoreStream = (value, limit) => {
  limit = limit > 0 ? limit : 0
  const ignoredValues = {}
  const isHistoryEnabled = limit > 0
  var history = null

  const initHistory = () => {
    if (isHistoryEnabled) {
      history = histable.create(limit)
      history.push(value)
    }
  }
  initHistory()
  if (value === undefined) {
    value = ignoredValues
  }

  const subject = new BehaviorSubject(value)
  const dispatchValue = (_value, push) => {
    var isDefined = _value !== undefined
    var isDiff = value !== _value

    if ([isDefined, isDiff].every(Boolean)) {
      value = _value
      subject.onNext(value)
    }
  }

  return {
    stream: subject.filter(x => x !== ignoredValues),
    set: cb => {
      const val = typeof cb === 'function' ? cb(value) : cb
      dispatchValue(val)
      if (isHistoryEnabled) {
        history.push(val)
      }
      return subject
    },
    end: () => {
      initHistory()
      subject.onCompleted()
    },
    get: () => value,
    undo: () => {
      if (isHistoryEnabled) {
        dispatchValue(history.undo())
      }
    },
    redo () {
      if (isHistoryEnabled) {
        dispatchValue(history.redo())
      }
    },
    reset () {
      initHistory()
    },
    get canUndo () {
      return history.canUndo
    },
    get canRedo () {
      return history.canRedo
    }
  }
}
