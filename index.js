if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dist/mini-auth-v1.js')
} else {
  module.exports = require('./dist/mini-auth-v1.common.js')
}
