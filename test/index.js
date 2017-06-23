const { test } = require('ava')
const denude = require('../src')


test('Native require still works', (t) => {
  let normal

  t.notThrows(() => {
    /* eslint-disable global-require */
    normal = require('./dummies/normal')
  })
  t.true(typeof normal === 'function')
})

test('Doesn\'t work with non-existent modules', (t) => {
  t.throws(() => {
    denude('./nonexistentfile')
  })
})

test('Doesn\'t work with primitive exports', (t) => {
  t.throws(() => {
    denude('./dummies/primitive')
  })
})

test('Works with normal exports', (t) => {
  let _public, _private

  t.notThrows(() => {
    _public = denude('./dummies/normal')
    _private = denude('./dummies/normal?private')
  })
  t.true(typeof _public === 'function')
  t.true(typeof _public.format === 'undefined')
  t.true(typeof _private === 'object')
  t.true(typeof _private.format === 'function')
  t.true(typeof _private.prefix === 'string')
  t.true(typeof _private.greet === 'function')
})

test('Works with modules with no default export', (t) => {
  let _public, _private

  t.notThrows(() => {
    _public = denude('./dummies/noDefaultExport')
    _private = denude('./dummies/noDefaultExport?private')
  })
  t.true(typeof _public === 'object')
  t.true(typeof _private === 'object')
  t.true(typeof _private.a === 'object')
})

test('Works with empty modules and undefined variables', (t) => {
  let _public, _private

  t.notThrows(() => {
    _public = denude('./dummies/empty')
    _private = denude('./dummies/empty?private')
    _public.q
    _private.q
  })
  t.true(typeof _private === 'object')
  t.true(typeof _public === 'object')
  t.true(typeof _private.w === 'undefined')
  t.true(typeof _public.w === 'undefined')
})

test('Works independently from require and caches results', (t) => {
  let required = require('./dummies/empty')
  let _publicA = denude('./dummies/empty')
  let _publicB = denude('./dummies/empty')
  let _privateA = denude('./dummies/empty?private')
  let _privateB = denude('./dummies/empty?private')

  t.true(required !== _publicA)
  t.true(required !== _privateA)
  t.true(_publicA === _publicB)
  t.true(_privateA === _privateB)
  t.true(_publicA.a === _publicB.a)
  t.true(_privateA.a === _privateB.a)
  t.true(_publicA.a === _privateB.a)
})

test('After registering, requires work like denudes', (t) => {
  require('../register')

  let requiredPublic = require('./dummies/normal')
  let requiredPrivate = require('./dummies/normal?private')
  let denudedPublic = denude('./dummies/normal')
  let denudedPrivate = denude('./dummies/normal?private')

  t.true(requiredPublic === denudedPublic)
  t.true(requiredPrivate === denudedPrivate)
  t.true(typeof requiredPublic === 'function')
  t.true(requiredPrivate.greet === denudedPrivate.greet)
  t.true(typeof requiredPrivate.greet === 'function')
})
