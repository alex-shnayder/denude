const { dirname, isAbsolute } = require('path')
const resolve = require('resolve')


module.exports = function resolveModule(path, caller) {
  if (isAbsolute(path)) {
    return path
  }

  let basedir = dirname(caller)
  return resolve.sync(path, { basedir })
}
