const { dirname, resolve } = require('path')


const DIRS_TO_EXCLUDE = [__dirname, resolve(__dirname, '../node_modules')]


module.exports = function getCallerFile() {
  let originalFunc = Error.prepareStackTrace
  let callerFile

  Error.prepareStackTrace = (err, stack) => {
    return stack
  }

  let err = new Error()
  callerFile = err.stack.find((callsite) => {
    let fileDir = dirname(callsite.getFileName())

    if (fileDir === 'internal') {
      return false
    }

    for (let i = 0; i < DIRS_TO_EXCLUDE.length; i++) {
      if (fileDir.startsWith(DIRS_TO_EXCLUDE[i])) {
        return false
      }
    }

    return true
  })

  Error.prepareStackTrace = originalFunc
  return callerFile && callerFile.getFileName()
}
