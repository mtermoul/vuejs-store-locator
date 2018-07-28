'use strict'
const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')
let localEnv = {}

try {
    // store your local env vars local.env.js file if needed
    localEnv = require('./local.env')
} catch(e) {
    localEnv = {}
}

module.exports = merge(localEnv, {
  NODE_ENV: '"development"'
})
