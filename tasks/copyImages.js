const chalk = require('chalk')
const cpx = require('cpx')

const GLOB_PATTERN = '**/*.{ico,gif,jpg,png,svg}'

function copyImages(srcDir, outDir) {
  return new Promise((resolve, reject) => {
    cpx.copy(`${srcDir}/${GLOB_PATTERN}`, outDir, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = (srcDir, outDir) => {
  console.log('')
  console.log(chalk.bold('✓ copy images'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return copyImages(srcDir, outDir)
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
