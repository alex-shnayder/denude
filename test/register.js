const { test } = require('ava')
require('../register')


test('Falls back to native require when no "?private"', (t) => {
  let normal, path

  t.notThrows(() => {
    /* eslint-disable global-require */
    normal = require('./dummies/normal')
    path = require('path')
  })
  t.true(typeof normal === 'function')
  t.true(typeof normal.greet === 'undefined')
  t.true(typeof path === 'object')
  t.true(typeof path.resolve === 'function')
})

test('Uses denude when there is "?private"', (t) => {
  let normal

  t.notThrows(() => {
    /* eslint-disable global-require */
    normal = require('./dummies/normal?private')
  })
  t.true(typeof normal === 'object')
  t.true(typeof normal.format === 'function')
  t.true(typeof normal.prefix === 'string')
  t.true(typeof normal.greet === 'function')
})
