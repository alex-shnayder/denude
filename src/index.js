const rewire = require('rewire')
const resolveFile = require('./resolveFile')


module.exports = function denude(path) {
  let fullPath = resolveFile(path)
  let _module = rewire(fullPath)

  if (!_module || typeof _module.__get__ !== 'function') {
    throw new Error(
      `Cannot denude module "${fullPath}" because ` +
      'its default export is a primitive'
    )
  }

  return new Proxy({}, {
    get(target, name) {
      return (typeof name === 'string') ? _module.__get__(name) : target
    },
  })
}
