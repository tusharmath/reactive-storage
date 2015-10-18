'use strict'
import Immutable from 'seamless-immutable'
import { BehaviorSubject } from 'rx'
import { Action } from './Action.js'

export class Storage {
  constructor( value) {
    this.value = Immutable(value)
    this.stream = new BehaviorSubject(this.value)
  }
  updateStore( value) {
    this.value = this.value.merge(value, {deep: true})
    this.stream.onNext(this.value)
  }
}
