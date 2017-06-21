const CURRENT_FILE = module.filename
const PARENT_FILE = module.parent.filename


module.exports = function getCallerFile() {
  let originalFunc = Error.prepareStackTrace

  try {
    Error.prepareStackTrace = (err, stack) => {
      return stack
    }

    let err = new Error()
    let callerFile = err.stack.find((callsite) => {
      let file = callsite.getFileName()
      return file !== CURRENT_FILE && file !== PARENT_FILE
    })

    Error.prepareStackTrace = originalFunc

    return callerFile && callerFile.getFileName()
  } catch (err) {
    throw new Error('Unable to determine the caller file')
  }
}
