import { Storage } from '../src/Store'
import { Observable } from 'rx'
describe('Storage', function () {
  it('is an observable', function () {
    Storage.should.instanceOf(Observable)
  })
})
