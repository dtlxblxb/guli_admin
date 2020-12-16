'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://127.0.0.1:9110"', // BASE_API: '"http://127.0.0.1:8110"' 由于引入网关
  OSS_PATH: '"https://dtjsb-file.oss-cn-beijing.aliyuncs.com"'
})
