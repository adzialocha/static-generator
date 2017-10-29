const { mkdir } = require('fs')

module.exports = createFolder = (path, mask = '0777') => {
  return new Promise((resolve, reject) => {
    mkdir(path, mask, err => {
      if (err) {
        if (err.code === 'EEXIST') {
          resolve()
        } else {
          reject(err)
        }
      } else {
        resolve()
      }
    })
  })
}
