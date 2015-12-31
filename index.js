/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

const BehaviorSubject = require('rx').BehaviorSubject

exports.createStoreAsStream = (value, options) => {
  const stream = new BehaviorSubject(value)
  return {
    getStream: () => stream,
    update: cb => {
      const _value = typeof cb === 'function' ? cb(value) : cb
      if (value !== _value) {
        value = _value
        stream.onNext(value)
      }
      return stream
    },
    }
  }
}
