/**
 * Created by tushar.mathur on 22/12/15.
 */

'use strict'

import {BehaviorSubject} from 'rx'

export const createStoreAsStream = value => {
  const stream = new BehaviorSubject(value)
  return {
    getStream: () => stream,
    update: cb => {
      const _value = cb(value)
      if (value !== _value) {
        value = _value
        stream.onNext(value)
      }
      return stream
    }
  }
}
