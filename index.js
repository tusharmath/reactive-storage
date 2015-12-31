/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreAsStream = (value, options) => {
  const history = value ? [value] : []
  const stream = new BehaviorSubject(value)

  const dispatchValue = (_value, push) => {
    if (_value === undefined) {
      return
    }
    if (value !== _value) {
      value = _value
      if (push === true) {
        history.push(value)
      }
      stream.onNext(value)
    }
  }
  return {
    getStream: () => stream,
    update: cb => {
      dispatchValue(typeof cb === 'function' ? cb(value) : cb, true)
      return stream
    },
    undo: () => {
      dispatchValue(history.pop(), false)
    }
  }
}
