const chalk = require('chalk')
const CleanCSS = require('clean-css')
const sass = require('node-sass')

const lib = require('../lib')

function convert(file) {
  return new Promise((resolve, reject) => {
    sass.render({
      file,
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.css)
      }
    })
  })
}

function clean(css) {
  return new CleanCSS({
    returnPromise: true,
  }).minify(css)
}

module.exports = (file, targetFile) => {
  console.log('')
  console.log(chalk.bold('✓ generate style assets'))

  return new Promise((resolve, reject) => {
    convert(file)
      .then(css => {
        return clean(css)
      })
      .then(cleanedCss => {
        return lib.createFile(targetFile, cleanedCss.styles)
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
