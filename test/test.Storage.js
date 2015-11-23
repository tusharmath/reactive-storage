import {Storage} from '../src/Storage'
import Immutable from 'seamless-immutable'
import {get, set} from 'lodash'

describe('Storage', function () {
  beforeEach(function () {
    this.init = {a: {b: {c: 1}}}
    this.store = new Storage({value: this.init})
    this.output = null
    this.store.connect().subscribe(x => this.output = x)
  })

  describe('updateStore()', function () {
    it('sets initial values', function () {
      this.output.should.deep.equal(this.init)
    })
    it('updates the store', function () {
      this.store.updateStore({a: 2})
      this.output.should.deep.equal({a: 2})
    })
    it('dispatches an event', function () {
      this.store.updateStore({a: 1})
      this.output.should.deep.equal({a: 1})
    })
    it('returns the new store', function () {
      this.store.updateStore({a: 120})
        .should.equal(this.output)
    })
    it('does not update the store', function () {
      this.store.updateStore(this.init)
      const a = this.output
      this.store.updateStore(this.init)
      const b = this.output
      a.should.equal(b)
    })
    it('override values', function () {
      const t = {x: {a: 1, b: 2, c: 3}}
      const store = new Storage({value: {}, get})
      store.updateStore(t).should.deep.equal(t)
      store.updateStore({x: {a: 1, c: 3}}, false).should.deep.equal({x: {a: 1, c: 3}})
    })
  })
  describe('connect()', function () {
    beforeEach(function () {
      this.init = {
        a: {aa: {aaa: 1}},
        b: {bb: {bbb: 100}},
        c: {cc: {ccc: 1000}}
      }
      this.store = new Storage({value: Immutable(this.init), get})
    })
    it('can selectively connect to paths', function () {
      const output = []
      const proxy = (path, value) => set({}, path, value)
      this.store.connect({a: 'a.aa.aaa', c: 'c.cc'}).subscribe(x => output.push(x))

      this.store.updateStore(s => s.merge(proxy('a.aa.aaa', 2), {deep: true}))
      this.store.updateStore(s => s.merge(proxy('a.aa.aaa', 3), {deep: true}))
      this.store.updateStore(s => s.merge(proxy('b.bb.bbb', 200), {deep: true}))
      this.store.updateStore(s => s.merge(proxy('c.cc.ccc', 2000), {deep: true}))

      output.should.deep.equal([
        {a: 1, c: {ccc: 1000}},
        {a: 2, c: {ccc: 1000}},
        {a: 3, c: {ccc: 1000}},
        {a: 3, c: {ccc: 2000}}
      ])
    })

    it('returns value stream if no path is provided', function () {
      var value
      this.store.connect().subscribe(x => value = x)
      value.should.deep.equal(this.init)
      value.should.not.equal(this.init)
    })
    it('ignores undefined values', function () {
      var value
      this.store.connect({x: 'w'}).subscribe(x => value = x)
      expect(value).to.be.undefined
    })
  })
})
