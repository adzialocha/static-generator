const fs = require('fs')

module.exports = (filename, content = '') => {
  return new Promise((success, reject) => {
    fs.writeFile(filename, content, err => {
      if (err) {
        reject(err)
      } else {
        success()
      }
    })
  })
}
