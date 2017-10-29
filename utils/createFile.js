const { writeFile } = require('fs')

module.exports = createFile = (file, content = '') => {
  return new Promise((resolve, reject) => {
    writeFile(file, content, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
