const { format } = require('util')


let prefix = 'Hello, '

function greet(name) {
  return format(`${prefix}%s!`, name)
}

module.exports = function helloWorld() {
  return greet('World')
}
