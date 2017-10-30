const chalk = require('chalk')
const glob = require('glob')
const { join } = require('path')

const { copyFile, getAllFolders } = require('../utils')

const GLOB_PATTERN = '**/*.{ico,gif,jpg,png,svg}'

function copyImages(srcDir, outDir) {
  return new Promise((resolve, reject) => {
    glob(`${srcDir}/${GLOB_PATTERN}`, (globErr, files) => {
      if (globErr) {
        reject(globErr)
      } else {
        Promise.all(files.map(file => {
          const splitted = file.split('/')
          const fileName = splitted[splitted.length - 1]

          return copyFile(file, join(outDir, fileName))
        }))
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  })
}

function copyViewImages(srcDir, outDir) {
  const srcViewsDir = join(srcDir, 'views')
  const views = getAllFolders(srcViewsDir)

  const promises = views.map(srcViewDir => {
    const splitted = srcViewDir.split('/')
    const viewSlug = splitted[splitted.length - 1]
    const outViewDir = join(outDir, viewSlug)

    return new Promise((resolve, reject) => {
      createFolder(outViewDir)
        .then(() => {
          copyImages(srcViewDir, outViewDir)
        })
        .then(() => {
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  })

  return Promise.all(promises)
}

module.exports = (srcDir, outDir) => {
  console.log('')
  console.log(chalk.bold('✓ copy images'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        const srcAssetsDir = join(srcDir, 'assets', 'images')
        const outAssetsDir = join(outDir, 'assets', 'images')

        return copyImages(srcAssetsDir, outAssetsDir)
      })
      .then(() => {
        return copyViewImages(srcDir, outDir)
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
