const fs = require('fs')

module.exports = (path, mask = 0777) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, mask, function(err) {
      if (err) {
        if (err.code == 'EEXIST') {
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
