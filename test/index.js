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
  let normal

  t.notThrows(() => {
    normal = denude('./dummies/normal')
  })
  t.true(typeof normal === 'object')
  t.true(typeof normal.format === 'function')
  t.true(typeof normal.prefix === 'string')
  t.true(typeof normal.greet === 'function')
})

test('Works with empty exports', (t) => {
  let empty

  t.notThrows(() => {
    empty = denude('./dummies/empty')
  })
  t.true(typeof empty === 'object')
  t.true(typeof empty.a === 'number')
})

