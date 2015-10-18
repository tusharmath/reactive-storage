'use strict'
import Immutable from 'seamless-immutable'
import { BehaviorSubject } from 'rx'
export const Storage = new BehaviorSubject(Immutable({}))
