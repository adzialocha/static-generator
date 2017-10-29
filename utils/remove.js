const rimraf = require('rimraf')

module.exports = remove = path => {
  return new Promise((resolve, reject) => {
    rimraf(path, {}, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
