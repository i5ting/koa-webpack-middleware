const devMiddleware = require('./devMiddleware')
const hotMiddleware = require('./hotMiddleware')
const compose = require('koa-compose')

module.exports = (compile, devConf, hotConf) => {
  return compose([
    devMiddleware(compile, Object.assign({
      noInfo: false,
      hot: true,
      serverSideRender: true
    }, devConf)),
    hotMiddleware(compile, Object.assign({
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 2000
    }, hotConf))
  ])
}
