const chalk = require('chalk')
const browserify = require('browserify')

const lib = require('../lib')

function convert(file) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

module.exports = (file, targetFile) => {
  console.log('')
  console.log(chalk.bold('✓ generate html files'))

  return new Promise((resolve, reject) => {
    convert(file)
      .then(minified => {
        return lib.createFile(targetFile, minified)
      })
      .then(() => {
        console.log(chalk.green('... done!'))
        resolve()
      })
      .catch(err => {
        console.log(chalk.red('... task failed!'))
        reject(err)
      })
  })
}
