const { join } = require('path')
const { lstatSync, readdirSync } = require('fs')

function isDirectory(source) {
  return lstatSync(source).isDirectory()
}

module.exports = getAllFolders = source => {
  return readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
}
