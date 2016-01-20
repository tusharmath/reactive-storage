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
  const store = createStoreStream(100, 100)
  store.getStream().subscribe(x => out.push(x))
  store.set(200)
  store.set(300)
  store.set(400)
  store.undo()
  t.same(out, [100, 200, 300, 400, 300])
})

test('undo()', t => {
  const out = []
  const store = createStoreStream(100, 100)
  store.getStream().subscribe(x => out.push(x))
  store.set(200)
  store.set(300)
  store.set(400)
  store.undo()
  store.undo()
  store.undo()
  store.undo()
  store.undo()
  t.same(out, [100, 200, 300, 400, 300, 200, 100])
})

test('redo+undo', t => {
  const out = []
  const store = createStoreStream(void 0, 100)
  store.getStream().subscribe(x => out.push(x))
  store.set(100) // 100
  store.set(200) // 200
  store.set(300) // 300
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
  const store = createStoreStream(void 0, 100)
  store.getStream().subscribe(x => out.push(x))
  store.set(100)
  store.set(200)
  store.set(300)
  store.undo()
  store.set(500)
  store.redo()
  store.undo()
  store.undo()
  store.redo()
  t.same(out, [100, 200, 300, 200, 500, 200, 100, 200])
})

test('history-limit:2', t => {
  const out = []
  const store = createStoreStream(0, 2)
  store.getStream().subscribe(x => out.push(x))
  store.set(100)
  store.set(200)
  store.set(300)
  store.set(400)
  store.set(500)
  store.undo()
  store.undo()
  store.undo()
  t.same(out, [0, 100, 200, 300, 400, 500, 400, 300])
})

test('history-limit:default', t => {
  const out = []
  const store = createStoreStream(0)
  store.getStream().subscribe(x => out.push(x))
  store.set(100)
  store.set(200)
  store.set(300)
  store.set(400)
  store.set(500)
  store.undo()
  store.undo()
  store.undo()
  t.same(out, [0, 100, 200, 300, 400, 500])
})

test('canUndo(),canRedo()', t => {
  const out = []
  const store = createStoreStream(0, 2)
  store.getStream().subscribe(x => out.push(x))
  store.set(100)
  t.true(store.canUndo)
  t.false(store.canRedo)
  store.undo()
  t.false(store.canUndo)
  t.true(store.canRedo)
})

test('reset()', t => {
  const out = []
  const store = createStoreStream(0, 2)
  store.getStream().subscribe(x => out.push(x))
  store.set(100)
  store.set(100)
  store.set(100)
  store.reset()
  t.false(store.canUndo)
  t.false(store.canRedo)
})

test('end()', t => {
  const out = []
  const store = createStoreStream(0, 2)
  store.getStream().subscribe(
    x => out.push(x),
    null,
    () => out.push('completed'))
  store.set(100)
  store.end()
  t.same(out, [0, 100, 'completed'])
})

test('end():history', t => {
  const out = []
  const store = createStoreStream(0, 2)
  store.getStream().subscribe(
    x => out.push(x),
    null,
    () => out.push('completed'))
  store.set(100)
  store.end()
  t.false(store.canUndo)
  t.false(store.canRedo)
})
