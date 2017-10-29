const chalk = require('chalk')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const lib = require('../lib')

function convert(targetDir, outputDir) {
  return imagemin([`${targetDir}/*.{jpg,png,svg}`], outputDir, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: '90' }),
      imageminSvgo(),
    ]
  })
}

module.exports = (targetDir, outputDir) => {
  console.log('')
  console.log(chalk.bold('✓ minify and copy images'))

  return new Promise((resolve, reject) => {
    convert(targetDir, outputDir)
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
