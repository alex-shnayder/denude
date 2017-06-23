const nativeRequire = require('module').prototype.require
const rewire = require('rewire')
const resolveModule = require('./resolveModule')
const getCallerFile = require('./getCallerFile')


const SEPARATOR = '?'


let cache = {}

function createDenudedModule(path) {
  let _public = rewire(path)

  if (!_public || typeof _public.__get__ !== 'function') {
    throw new Error(
      `Cannot denude module "${path}" because ` +
      'its default export is a primitive'
    )
  }

  let get = (target, name) => {
    if (typeof name !== 'string') {
      // Is this the correct check for accessing the object itself?
      return target
    }

    try {
      return _public.__get__(name)
    } catch (err) {}
  }
  let _private = new Proxy({}, { get })

  return { public: _public, private: _private }
}

module.exports = function denude(path) {
  let [base, mode] = path.split(SEPARATOR)
  let caller = getCallerFile(path)
  let fullPath = resolveModule(base, caller)

  if (
    caller.includes('node_modules') ||
    (!fullPath.includes('/') && !fullPath.includes('\\'))
  ) {
    return nativeRequire(fullPath)
  }

  mode = (mode === 'private') ? mode : 'public'
  cache[fullPath] = cache[fullPath] || createDenudedModule(fullPath)

  return cache[fullPath][mode]
}
