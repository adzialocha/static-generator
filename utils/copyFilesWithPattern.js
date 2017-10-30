const glob = require('glob')
const { join } = require('path')

const copyFile = require('./copyFile')

module.exports = copyImages = (srcDir, outDir, globPattern) => {
  return new Promise((resolve, reject) => {
    glob(`${srcDir}/${globPattern}`, (globErr, files) => {
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
