/**
 * Created by tushar.mathur on 31/12/15.
 */

'use strict'

import test from 'ava'
import {createStoreAsStream} from './'

test('update(function)', t => {
  const out = []
  const store = createStoreAsStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.update(x => 200)
  store.update(x => 300)
  t.same(out, [100, 200, 300])
})

test('update(value)', t => {
  const out = []
  const store = createStoreAsStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.update(200)
  store.update(300)
  t.same(out, [100, 200, 300])
})

test('update(value):distinct', t => {
  const out = []
  const store = createStoreAsStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.update(200)
  store.update(200)
  t.same(out, [100, 200])
})

test('undo()', t => {
  const out = []
  const store = createStoreAsStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.update(200)
  store.update(300)
  store.update(400)
  store.undo()
  store.undo()
  store.undo()
  store.undo()
  store.undo()
  t.same(out, [100, 200, 300, 400, 300, 200, 100])
})
