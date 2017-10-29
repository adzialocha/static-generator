static-generator
======

Node command line application equipped with great tools for generating the most simple static pages.

## Features

- *ES6* js via babelify and *module support* with browserify
- Write your stylesheets in *scss*
- Manage content in *markdown* and meta data in *json* files
- Rich template inheritance, filters, etc. via *nunjucks*
- Generates simple and *minified* css, js and html

## Usage

Install `static-generator` as a global tool or include it as a dependency to your static page project (probably together with a *serve* and *watch* task).

```
npm i -g static-generator

static-generator new [--source_dir "./_src"]
static-generator build [--source_dir "./_src"] [--output_dir "./"]
static-generator clear [--source_dir "./_src"] [--output_dir "./"]
```

## Project structure

Run `new` task to create a starter template folder structure. Every project follows a similar structure like this (files and folders marked with * are needed):

```
index.md * (root content)
data.json * (global meta data, can be used in templates)
assets/ *
    scripts/ *
        app.js * (entry js file)
        form.js
        ...
    styles/ *
        app.scss * (entry scss file)
        layout.scss
        slider.scss
        ...
    images/ *
        favicon.ico
        ...
views/ *
    about/
        index.md
        data.json
    contact/
        index.md
        data.json
    ... more subviews
        index.md
        data.json
layout/ *
    default.html * (main layout file)
    navigation.html
    ... more partials
```
