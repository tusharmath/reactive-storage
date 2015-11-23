/**
 * Created by tushar.mathur on 23/11/15.
 */

'use strict'
import {BehaviorSubject} from 'rx'

class Action {
  constructor (actionStream) {
    this.dispatch = params => actionStream.onNext({action: this, params})
    this.observable = actionStream.filter(x => x.action === this).pluck('params')
  }
}

export const createAction = (stream) => new Action(stream)
export const INIT = createAction()
export const createActionStream = (params) => new BehaviorSubject({action: INIT, params})
