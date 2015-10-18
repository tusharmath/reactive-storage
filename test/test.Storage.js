import { Storage } from '../src/Storage.js'
describe('updateStore()', function () {
  beforeEach(function () {
    this.store = new Storage({a: 1})
  })
  it('sets initial values', function () {
    this.store.value.should.deep.equal({a: 1})
  })
  it('updates the store', function () {
    this.store.updateStore({a: 2})
    this.store.value.should.deep.equal({a: 2})
  })
  it('dispatches an event', function () {
    var value = 100
    this.store.stream.subscribe(x => value = x)
    this.store.updateStore({a: 1})
    value.should.deep.equal({a: 1})
  })
})
