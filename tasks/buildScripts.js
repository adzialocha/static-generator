const browserify = require('browserify')
const chalk = require('chalk')

const { createFile } = require('../utils')

function convertAndMinify(srcFile) {
  return new Promise((resolve, reject) => {
    browserify(srcFile)
      .transform('babelify', { presets: ['@babel/preset-env'] })
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

module.exports = (srcFile, outFile) => {
  console.log('')
  console.log(chalk.bold('✓ generate js assets'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return convertAndMinify(srcFile)
      })
      .then(minified => {
        return createFile(outFile, minified)
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
