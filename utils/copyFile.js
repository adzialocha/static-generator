const { createReadStream, createWriteStream } = require('fs')

module.exports = copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    let isDoneCalled = false

    function done(err) {
      if (!isDoneCalled) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }

        isDoneCalled = true
      }
    }

    const readStream = createReadStream(source)

    readStream.on('error', err => {
      done(err)
    })

    const writeStream = createWriteStream(target)

    writeStream.on('error', err => {
      done(err)
    })

    writeStream.on('close', () => {
      done()
    })

    readStream.pipe(writeStream)
  })
}
