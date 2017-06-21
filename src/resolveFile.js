const { dirname, isAbsolute } = require('path')
const resolve = require('resolve')


function getCallerFile() {
  let originalFunc = Error.prepareStackTrace

  try {
    Error.prepareStackTrace = (err, stack) => {
      return stack
    }

    let err = new Error()
    let callerFile = err.stack.find((callsite) => {
      let fileDir = dirname(callsite.getFileName())
      return fileDir !== __dirname && fileDir !== 'internal'
    })

    Error.prepareStackTrace = originalFunc

    return callerFile && callerFile.getFileName()
  } catch (err) {
    throw new Error('Unable to determine the caller file')
  }
}

module.exports = function resolveFile(path) {
  if (isAbsolute(path)) {
    return path
  }

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

  let basedir = dirname(callerFile)
  return resolve.sync(path, { basedir })
}
