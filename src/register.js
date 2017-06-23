const Module = require('module')
const denude = require('./index')


Module.prototype.require = denude
