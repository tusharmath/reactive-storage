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

test('undo():single', t => {
  const out = []
  const store = createStoreStream(100)
  store.getStream().subscribe(x => out.push(x))
  store.update(200)
  store.update(300)
  store.update(400)
  store.undo()
  t.same(out, [100, 200, 300, 400, 300])
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

test('redo+undo', t => {
  const out = []
  const store = createStoreAsStream()
  store.getStream().subscribe(x => out.push(x))
  store.update(100) // 100
  store.update(200) // 200
  store.update(300) // 300
  store.undo() // 200
  store.undo() // 100
  store.undo() // (noop)
  store.undo() // (noop)

  store.redo() // 200
  store.redo() // 300
  store.redo() // (noop)
  store.undo() // 200
  store.undo() // 100
  store.undo() // (noop)

  t.same(out, [100, 200, 300, 200, 100, 200, 300, 200, 100])
})

test('redo+undo+update', t => {
  const out = []
  const store = createStoreAsStream()
  store.getStream().subscribe(x => out.push(x))
  store.update(100)
  store.update(200)
  store.update(300)
  store.undo()
  store.update(500)
  store.redo()
  store.undo()
  store.undo()
  store.redo()
  t.same(out, [100, 200, 300, 200, 500, 200, 100, 200])
})
