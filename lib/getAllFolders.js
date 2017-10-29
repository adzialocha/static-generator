const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

function isDirectory(source) {
  return lstatSync(source).isDirectory()
}

module.exports = source => {
 return readdirSync(source).map(name => join(source, name)).filter(isDirectory)
}
