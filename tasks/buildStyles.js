const chalk = require('chalk')
const CleanCSS = require('clean-css')
const sass = require('sass')

const { createFile } = require('../utils')

function convert(srcFile) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: srcFile,
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.css)
      }
    })
  })
}

function minify(css) {
  return new CleanCSS({
    returnPromise: true,
  }).minify(css)
}

module.exports = (srcFile, outFile) => {
  console.log('')
  console.log(chalk.bold('✓ generate style assets'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return convert(srcFile)
      })
      .then(css => {
        return minify(css)
      })
      .then(cleanedCss => {
        return createFile(outFile, cleanedCss.styles)
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
