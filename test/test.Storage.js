const Storage = require('../src/Storage.js').Storage

describe('Storage', function () {
  beforeEach(function () {
    this.init = {a: {b: {c: 1}}}
    this.store = new Storage(this.init)
    this.output = null
    this.store.stream.subscribe(x => this.output = x)
  })

  describe('updateStore()', function () {
    it('sets initial values', function () {
      this.store.value.should.deep.equal(this.init)
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
})
