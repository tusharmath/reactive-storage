import { Storage } from '../src/Storage'

describe('Storage', function () {
  beforeEach(function () {
    this.init = {a: {b: {c: 1}}}
    this.store = new Storage(this.init)
    this.output = null
    this.store._stream.subscribe(x => this.output = x)
  })

  describe('updateStore()', function () {
    it('sets initial values', function () {
      this.store._value.should.deep.equal(this.init)
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
  })
  describe('updatePath()', function () {
    it('updates on path', function () {
      this.store.updatePath('a.b.c', 100)
      this.output.should.deep.equal({a: {b: {c: 100}}})
    })
  })

  describe('togglePath()', function () {
    it('toggles on path', function () {
      this.store.togglePath('a.b.c')
      this.output.a.b.c.should.equal(false)
      this.store.togglePath('a.b.c')
      this.output.a.b.c.should.equal(true)
    })
  })

  describe('incrementPath()', function () {
    it('increments path', function () {
      this.store.incrementPath('a.b.c')
      this.output.a.b.c.should.equal(2)
      this.store.incrementPath('a.b.c')
      this.store.incrementPath('a.b.c')
      this.output.a.b.c.should.equal(4)
    })
  })
  describe('decrementPath()', function () {
    it('increments path', function () {
      this.store.decrementPath('a.b.c')
      this.output.a.b.c.should.equal(0)
      this.store.decrementPath('a.b.c')
      this.store.decrementPath('a.b.c')
      this.output.a.b.c.should.equal(-2)
    })
  })
  describe('connect()', function () {
    beforeEach(function () {
      this.init = {
        a: {aa: {aaa: 1}},
        b: {bb: {bbb: 100}},
        c: {cc: {ccc: 1000}}
      }
      this.store = new Storage(this.init)
    })
    it('can selectively connect to paths', function () {
      const output = []
      this.store
        .connect({a: 'a.aa.aaa', c: 'c.cc'})
        .subscribe(x => output.push(x))
      this.store.updatePath('a.aa.aaa', 2)
      this.store.updatePath('a.aa.aaa', 3)

      this.store.updatePath('b.bb.bbb', 200)
      this.store.updatePath('c.cc.ccc', 2000)
      output.should.deep.equal([
        {a: 1}, {c: {ccc: 1000}},
        {a: 2}, {a: 3},
        {c: {ccc: 2000}}
      ])
    })

    it('returns value stream if no path is provided', function () {
      var value
      this.store.connect().subscribe(x => value = x)
      value.should.deep.equal(this.init)
      value.should.not.equal(this.init)
    })
  })
})
