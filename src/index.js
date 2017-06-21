const { dirname, resolve } = require('path')
const rewire = require('rewire')
const getCallerFile = require('./getCallerFile')


module.exports = function denude(path) {
  let callerFile

  try {
    callerFile = getCallerFile()
  } catch (err) {}

  if (!callerFile) {
    throw new Error(
      'Unable to resolve the path of the module that calls ' +
      `\`denude(${path})\`. Perhaps the environment (node version, OS, etc.) ` +
      'is incompatible with denude'
    )
  }

  let fullPath = resolve(dirname(callerFile), path)
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
