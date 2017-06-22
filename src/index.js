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

  let get = (target, name) => {
    if (typeof name !== 'string') {
      // Is this the correct check for accessing the object itself?
      return target
    }

    try {
      return _module.__get__(name)
    } catch (err) {}
  }

  return new Proxy({}, { get })
}
