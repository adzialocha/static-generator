const chalk = require('chalk')
const browserify = require('browserify')

const lib = require('../lib')

function convert(file) {
  return new Promise((resolve, reject) => {
    browserify(file)
      .transform('babelify', { presets: ['env'] })
      .transform('uglifyify', { global: true })
      .bundle((err, buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(buffer)
        }
      })
  })
}

module.exports = (file, targetFile) => {
  console.log('')
  console.log(chalk.bold('✓ generate js assets'))

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
