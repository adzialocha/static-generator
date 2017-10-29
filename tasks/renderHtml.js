const chalk = require('chalk')
const fs = require('fs')
const htmlMinifier = require('html-minifier').minify
const marked = require('marked')
const nunjucks = require('nunjucks')
const path = require('path')

const { createFile, createFolder, getAllFolders } = require('../lib')

const DATA_FILE_NAME = 'data.json'
const LAYOUT_DEFAULT_FILE = 'default.html'
const MARKDOWN_FILE_NAME = 'index.md'
const TARGET_FILE = 'index.html'

// Custom marked renderer
const renderer = new marked.Renderer()

renderer.link = (href, title, text) => {
  if (title) {
    return `<a href="${href}" title="${title}" target="_blank">${text}</a>`
  } else {
    return `<a href="${href}" target="_blank">${text}</a>`
  }
}

function readVariables(targetDir) {
  const file = path.join(targetDir, DATA_FILE_NAME)

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      resolve({})
    } else {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data))
        }
      })
    }
  })
}

function convertHtml(folder, variables) {
  const layoutDefaultFile = path.join(folder, 'layout', LAYOUT_DEFAULT_FILE)

  return new Promise((resolve, reject) => {
    fs.readFile(layoutDefaultFile, (err, content) => {
      if (err) {
        reject(err)
      } else {
        nunjucks.renderString(
          content.toString(),
          variables,
          (err, result) => {
            if (err) {
              reject(err)
            } else {
              const minified = htmlMinifier(result, {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
              })

              resolve(
                minified
              )
            }
          }
        )
      }
    })
  })
}

function convertMarkdown(folder) {
  const file = path.join(folder, MARKDOWN_FILE_NAME)

  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, content) => {
      if (err) {
        reject(err)
      } else {
        marked(content.toString(), {
          renderer,
          breaks: true,
        }, (err, markdown) => {
          if (err) {
            reject(err)
          } else {
            resolve(markdown)
          }
        })
      }
    })
  })
}

function convert(targetDir, folder, outputDir, globalVariables) {
  return new Promise((resolve, reject) => {
    Promise.all([
      convertMarkdown(folder),
      readVariables(folder)
    ])
      .then(results => {
        const content = results[0]
        const pageVariables = results[1]

        return convertHtml(
          targetDir,
          Object.assign(
            {},
            globalVariables,
            pageVariables,
            { content },
          )
        )
      })
      .then(result => {
        const targetFile = path.join(outputDir, TARGET_FILE)
        return createFile(targetFile, result)
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = (targetDir, outputDir) => {
  console.log('')
  console.log(chalk.bold('✓ generate html files'))

  return new Promise((resolve, reject) => {
    readVariables(targetDir)
      .then(globalVariables => {
        const layoutFolder = path.join(targetDir, 'layout')
        const viewsFolder = path.join(targetDir, 'views')

        nunjucks.configure(layoutFolder, {
          noCache: true,
        })

        const views = getAllFolders(viewsFolder)

        return Promise.all([
          convert(targetDir, targetDir, outputDir, globalVariables),
          views.map(folder => {
            const splitted = folder.split('/')
            const slug = splitted[splitted.length - 1]

            return new Promise((resolve, reject) => {
              createFolder(path.join(outputDir, slug))
                .then(() => {
                  convert(
                    targetDir,
                    folder,
                    path.join(outputDir, slug),
                    globalVariables
                  )
                    .then(() => {
                      resolve()
                    })
                    .catch(err => {
                      reject(err)
                    })
                })
            })
          })
        ])
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
