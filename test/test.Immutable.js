/**
 * Created by tushar.mathur on 19/10/15.
 */

'use strict'
var Immutable = require('../src/Immutable')
const createImmutable = Immutable.createImmutable
const toJS = Immutable.toJS

describe('Immutable', function () {
  describe('CreateImmutable()', function () {
    it('creates immutable objects', function () {
      var obj = {a: {b: {c: 1}}}
      createImmutable(obj).toJS().should.deep.equal(obj)
    })
  })
  describe('toJS()', function () {
    it('converts immutable map to JS version', function () {
      var obj = {a: {b: {c: 1}}}
      var immutable = createImmutable(obj)
      toJS(immutable).should.deep.equal(obj)
    })

    it('converts immutable list to JS version', function () {
      var obj = [10, 20, 30, 40]
      var immutable = createImmutable(obj)
      toJS(immutable).should.deep.equal({0: 10, 1: 20, 2: 30, 3: 40})
    })
  })
})
