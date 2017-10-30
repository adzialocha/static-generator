const chalk = require('chalk')

const { copyFilesWithPattern } = require('../utils')

const GLOB_PATTERN = '*.{svg,woff,woff2,ttf,eot}'

module.exports = (srcDir, outDir) => {
  console.log('')
  console.log(chalk.bold('✓ copy fonts'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return copyFilesWithPattern(
          srcDir,
          outDir,
          GLOB_PATTERN
        )
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
