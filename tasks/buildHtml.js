const chalk = require('chalk')
const htmlMinifier = require('html-minifier').minify
const marked = require('marked')
const nunjucks = require('nunjucks')
const { existsSync, readFile } = require('fs')
const { join } = require('path')

const {
  createFile,
  createFolder,
  getAllFolders,
} = require('../utils')

const DATA_FILE_NAME = 'data.json'
const LAYOUT_DEFAULT_FILE = 'default.html'
const MARKDOWN_FILE_NAME = 'index.md'
const TARGET_FILE = 'index.html'

// Custom marked renderer
const renderer = new marked.Renderer()

function readDataFile(srcViewDir) {
  const file = join(srcViewDir, DATA_FILE_NAME)

  return new Promise((resolve, reject) => {
    if (!existsSync(file)) {
      resolve({})
    } else {
      readFile(file, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data))
        }
      })
    }
  })
}

function generateHtml(srcDir, data) {
  const layoutDefaultFile = join(srcDir, 'layout', LAYOUT_DEFAULT_FILE)

  return new Promise((resolve, reject) => {
    readFile(layoutDefaultFile, (fileErr, content) => {
      if (fileErr) {
        reject(fileErr)
      } else {
        nunjucks.renderString(content.toString(), data, (err, result) => {
          if (err) {
            reject(err)
          } else {
            const minified = htmlMinifier(result, {
              collapseWhitespace: true,
              minifyCSS: true,
              minifyJS: true,
            })

            resolve(minified)
          }
        })
      }
    })
  })
}

function convertMarkdown(srcViewDir) {
  const file = join(srcViewDir, MARKDOWN_FILE_NAME)

  return new Promise((resolve, reject) => {
    readFile(file, (fileErr, content) => {
      if (fileErr) {
        reject(fileErr)
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

function generateView(srcDir, srcViewDir, outViewDir, globalData) {
  return new Promise((resolve, reject) => {
    Promise.all([
      convertMarkdown(srcViewDir),
      readDataFile(srcViewDir),
    ])
      .then(results => {
        const content = results[0]
        const pageData = results[1]

        return generateHtml(
          srcDir,
          Object.assign({}, globalData, pageData, { content })
        )
      })
      .then(result => {
        const outFile = join(outViewDir, TARGET_FILE)
        return createFile(outFile, result)
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

function generateMainView(srcDir, outDir, globalData) {
  return generateView(
    srcDir,
    srcDir,
    outDir,
    globalData
  )
}

function generateSubViews(srcViewsDir, srcDir, outDir, globalData) {
  const views = getAllFolders(srcViewsDir)

  const promises = views.map(srcViewDir => {
    const splitted = srcViewDir.split('/')
    const viewSlug = splitted[splitted.length - 1]
    const outViewDir = join(outDir, viewSlug)

    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => {
          return createFolder(join(outDir, viewSlug))
        })
        .then(() => {
          generateView(
            srcDir,
            srcViewDir,
            outViewDir,
            globalData
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

  return Promise.all(promises)
}

module.exports = (srcDir, outDir) => {
  console.log('')
  console.log(chalk.bold('✓ generate html files'))

  const srcLayoutDir = join(srcDir, 'layout')
  const srcViewsDir = join(srcDir, 'views')

  nunjucks.configure(srcLayoutDir, {
    noCache: true,
  })

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return readDataFile(srcDir)
      })
      .then(globalData => {
        return Promise.all([
          generateMainView(
            srcDir,
            outDir,
            globalData
          ),
          generateSubViews(
            srcViewsDir,
            srcDir,
            outDir,
            globalData
          ),
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
