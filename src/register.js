const Module = require('module')
const resolveFile = require('./resolveFile')
const denude = require('./index')


const SEPARATOR = '?'


let _require = Module.prototype.require

Module.prototype.require = (path) => {
  let [base, suffix] = path.split(SEPARATOR)

  if (suffix === 'private') {
    return denude(base)
  }

  path = resolveFile(path)
  return _require.call(this, path)
}
