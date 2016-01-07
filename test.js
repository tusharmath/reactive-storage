/**
 * Created by tushar.mathur on 31/12/15.
 */

'use strict'

import test from 'ava'
import {createStoreStream} from './'

test('constructor()', t => {
  const out = []
  const store = createStoreStream()
  store.getStream().subscribe(x => out.push(x))
  store.set(x => 200)
  store.set(x => 300)
  t.same(out, [200, 300])
})

test('update(function)', t => {
  const out = []
  const store = createStoreStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.set(x => 200)
  store.set(x => 300)
  t.same(out, [100, 200, 300])
})

test('update(value)', t => {
  const out = []
  const store = createStoreStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.set(200)
  store.set(300)
  t.same(out, [100, 200, 300])
})

test('update(value):distinct', t => {
  const out = []
  const store = createStoreStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.set(200)
  store.set(200)
  t.same(out, [100, 200])
})

test('update(undefined)', t => {
  const out = []
  const store = createStoreStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.set(200)
  store.set()
  store.set()
  store.set(300)
  t.same(out, [100, 200, 300])
})
