const { dirname, join } = require('path')


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

    return (
      !fileDir.startsWith(__dirname) &&
      !fileDir.includes(join('node_modules', 'rewire')) &&
      !fileDir.includes(join('node_modules', 'resolve'))
    )
  })

  Error.prepareStackTrace = originalFunc
  return callerFile && callerFile.getFileName()
}
