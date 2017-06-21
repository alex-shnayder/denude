# denude ![npm-version](https://img.shields.io/npm/v/denude.svg)

*All that is hidden shall be revealed*

Although testing private members is considered an antipattern, sometimes you really, *really* need to. Denude makes it easy to require functions and variables from the top scope of a module.


## Usage

Module you want to test:

```js
const { format } = require('util')


let prefix = 'Hello, '

function greet(name) {
  return format(`${prefix}%s!`, name)
}

module.exports = function helloWorld() {
  return greet('World')
}

```

Test file:

```js
const denude = require('denude')
const helloWorld = require('./module') // public parts
const { format, prefix, greet } = denude('./module') // private parts

// Some tests...
```


### Overriding require

You can use `require('denude/register')` to patch the native require globally. After that, any require that is passed a path with the `?private` prefix will return the private members instead of the exports.

Example:

```js
require('denude/register')

const helloWorld = require('./module') // public parts
const { format, prefix, greet } = require('./module?private') // private parts
```

This technique is useful with testing frameworks like [mocha](https://github.com/mochajs/mocha) and [ava](https://github.com/avajs/ava) that allow requiring modules on run:

```shell
mocha --require denude/register test
```


## License

[ISC](LICENSE)
